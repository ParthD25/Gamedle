import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createDatabaseSchema, getDatabase } from './DB/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GameDataImporter {
    constructor() {
        this.db = null;
        this.batchSize = 1000; // Process games in batches
        this.stats = {
            gamesProcessed: 0,
            genresAdded: 0,
            companiesAdded: 0,
            platformsAdded: 0,
            errors: 0
        };
        
        // Cache for IDs to avoid duplicate inserts
        this.genreCache = new Map();
        this.companyCache = new Map();
        this.platformCache = new Map();
    }

    async initialize() {
        console.log('Setting up database schema...');
        await createDatabaseSchema();
        this.db = getDatabase();
        
        // Pre-populate caches with existing data
        await this.populateCaches();
        
        console.log('Database initialized successfully.');
    }

    async populateCaches() {
        return new Promise((resolve, reject) => {
            const queries = [
                { sql: 'SELECT id, name FROM genres', cache: this.genreCache },
                { sql: 'SELECT id, name FROM companies', cache: this.companyCache },
                { sql: 'SELECT id, name FROM platforms', cache: this.platformCache }
            ];

            let completed = 0;
            
            queries.forEach(({ sql, cache }) => {
                this.db.all(sql, [], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    rows.forEach(row => {
                        cache.set(row.name, row.id);
                    });
                    
                    completed++;
                    if (completed === queries.length) {
                        resolve();
                    }
                });
            });
        });
    }

    async insertOrGetGenre(genreId, genreName) {
        if (this.genreCache.has(genreName)) {
            return this.genreCache.get(genreName);
        }

        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT OR IGNORE INTO genres (id, name) VALUES (?, ?)',
                [genreId, genreName],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    // Cache the ID
                    this.genreCache.set(genreName, genreId);
                    this.stats.genresAdded++;
                    resolve(genreId);
                }.bind(this)
            );
        });
    }

    async insertOrGetCompany(companyId, companyName) {
        if (this.companyCache.has(companyName)) {
            return this.companyCache.get(companyName);
        }

        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT OR IGNORE INTO companies (id, name) VALUES (?, ?)',
                [companyId, companyName],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    this.companyCache.set(companyName, companyId);
                    this.stats.companiesAdded++;
                    resolve(companyId);
                }.bind(this)
            );
        });
    }

    async insertOrGetPlatform(platformId, platformName) {
        if (this.platformCache.has(platformName)) {
            return this.platformCache.get(platformName);
        }

        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT OR IGNORE INTO platforms (id, name) VALUES (?, ?)',
                [platformId, platformName],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    this.platformCache.set(platformName, platformId);
                    this.stats.platformsAdded++;
                    resolve(platformId);
                }.bind(this)
            );
        });
    }

    async insertGame(game) {
        return new Promise((resolve, reject) => {
            const { id, name, first_release_date, rating } = game;
            
            this.db.run(
                'INSERT OR REPLACE INTO games (id, name, first_release_date, rating) VALUES (?, ?, ?, ?)',
                [id, name, first_release_date || null, rating || null],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async insertGameRelationships(gameId, game) {
        const promises = [];

        // Insert game-genre relationships
        if (game.genres && Array.isArray(game.genres)) {
            for (const genre of game.genres) {
                try {
                    await this.insertOrGetGenre(genre.id, genre.name);
                    promises.push(
                        new Promise((resolve, reject) => {
                            this.db.run(
                                'INSERT OR IGNORE INTO game_genres (game_id, genre_id) VALUES (?, ?)',
                                [gameId, genre.id],
                                (err) => err ? reject(err) : resolve()
                            );
                        })
                    );
                } catch (error) {
                    console.error(`Error processing genre for game ${gameId}:`, error);
                }
            }
        }

        // Insert game-company relationships
        if (game.involved_companies && Array.isArray(game.involved_companies)) {
            for (const involvedCompany of game.involved_companies) {
                if (involvedCompany.company) {
                    try {
                        await this.insertOrGetCompany(involvedCompany.company.id, involvedCompany.company.name);
                        promises.push(
                            new Promise((resolve, reject) => {
                                this.db.run(
                                    'INSERT OR IGNORE INTO game_companies (game_id, company_id) VALUES (?, ?)',
                                    [gameId, involvedCompany.company.id],
                                    (err) => err ? reject(err) : resolve()
                                );
                            })
                        );
                    } catch (error) {
                        console.error(`Error processing company for game ${gameId}:`, error);
                    }
                }
            }
        }

        // Insert game-platform relationships
        if (game.platforms && Array.isArray(game.platforms)) {
            for (const platform of game.platforms) {
                try {
                    await this.insertOrGetPlatform(platform.id, platform.name);
                    promises.push(
                        new Promise((resolve, reject) => {
                            this.db.run(
                                'INSERT OR IGNORE INTO game_platforms (game_id, platform_id) VALUES (?, ?)',
                                [gameId, platform.id],
                                (err) => err ? reject(err) : resolve()
                            );
                        })
                    );
                } catch (error) {
                    console.error(`Error processing platform for game ${gameId}:`, error);
                }
            }
        }

        await Promise.all(promises);
    }

    async processBatch(games) {
        return new Promise((resolve, reject) => {
            this.db.run('BEGIN TRANSACTION', async (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    for (const game of games) {
                        await this.insertGame(game);
                        await this.insertGameRelationships(game.id, game);
                        this.stats.gamesProcessed++;
                    }

                    this.db.run('COMMIT', (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                } catch (error) {
                    this.db.run('ROLLBACK', () => {
                        this.stats.errors++;
                        reject(error);
                    });
                }
            });
        });
    }

    async importGamesData(jsonFilePath) {
        console.log('Reading games data from JSON file...');
        
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        const games = JSON.parse(jsonData);

        console.log(`Found ${games.length} games to import.`);
        console.log('Starting import process...\n');

        const startTime = Date.now();
        
        // Process games in batches
        for (let i = 0; i < games.length; i += this.batchSize) {
            const batch = games.slice(i, i + this.batchSize);
            
            try {
                await this.processBatch(batch);
                
                // Progress update
                const progress = Math.round((this.stats.gamesProcessed / games.length) * 100);
                const elapsed = (Date.now() - startTime) / 1000;
                const rate = this.stats.gamesProcessed / elapsed;
                
                console.log(`Progress: ${progress}% (${this.stats.gamesProcessed}/${games.length}) - Rate: ${rate.toFixed(1)} games/sec`);
                
            } catch (error) {
                console.error(`Error processing batch ${Math.floor(i / this.batchSize) + 1}:`, error);
                this.stats.errors++;
            }
        }

        const totalTime = (Date.now() - startTime) / 1000;
        console.log('\\n=== Import Complete ===');
        console.log(`Total time: ${totalTime.toFixed(2)} seconds`);
        console.log(`Games processed: ${this.stats.gamesProcessed}`);
        console.log(`Genres added: ${this.stats.genresAdded}`);
        console.log(`Companies added: ${this.stats.companiesAdded}`);
        console.log(`Platforms added: ${this.stats.platformsAdded}`);
        console.log(`Errors: ${this.stats.errors}`);
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

// Main execution function
async function main() {
    const importer = new GameDataImporter();
    
    try {
        await importer.initialize();
        
        const jsonPath = path.join(__dirname, 'GamesData.json');
        
        if (!fs.existsSync(jsonPath)) {
            console.error('GamesData.json file not found at:', jsonPath);
            process.exit(1);
        }
        
        await importer.importGamesData(jsonPath);
        
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    } finally {
        importer.close();
    }
}

// Run the import if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { GameDataImporter };
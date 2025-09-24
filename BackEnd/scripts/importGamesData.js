import fs from 'fs'
import { DB } from '../DB/schema.js'

// Variables to keep track of the progress
let gamesCount = 0
let genresCount = 0
let companiesCount = 0
let platformsCount = 0

console.log('Starting to import games data.............' )

// Reading the JSON file
// Source: MDN Web Docs. "fs.readFileSync()." 
// Mozilla, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse. 
// Accessed 22 Sept. 2025.
console.log ('Reading GamesData.json file...')
const data = fs.readFileSync('./GamesData.json', 'utf8' )
const games = JSON.parse(data)

console.log ('Found ' + games.length + ' games to import ')

// Function to add a genre to the database
// Source: SQLite Tutorial. "SQLite Node.js: Inserting Data Into a Table." 
// SQLite Tutorial, https://www.sqlitetutorial.net/sqlite-nodejs/insert/. 
// Accessed 22 Sept. 2025.
function addGenre (genreId, genreName ) {
    const sql = `INSERT OR IGNORE INTO genres (id, name) VALUES (?, ?)`
    
    DB.run(sql, [genreId, genreName], function(err) {
        if (err) {
            console.log('Error has occured while trying to add genre:', err)
        } else {
            genresCount++
        }
    } )
}

// Functions to add a company into the database
function addCompany(companyId, companyName) {
    const sql = `INSERT OR IGNORE INTO companies (id, name) VALUES (?, ?)`
    
    DB.run(sql, [companyId, companyName], function(err) {
        if (err) {
            console.log('Error adding company:', err)
        } else {
            companiesCount++
        }
    } )
}

// Function to add a platform to the database
function addPlatform(platformId, platformName) {
    const sql = `INSERT OR IGNORE INTO platforms (id, name) VALUES (?, ?)`
    
    DB.run(sql, [platformId, platformName], function(err) {
        if (err) {
            console.log('Error adding platform:', err)
        } else
             {
            platformsCount++
         }
    }  )
}

// Function to add a game to database
// Source: SQLite Tutorial. "SQLite Node.js: Inserting Data Into a Table." 
// SQLite Tutorial, https://www.sqlitetutorial.net/sqlite-nodejs/insert/. 
// Accessed 22 Sept. 2025.
function addGame(game) {
    const sql = `INSERT OR REPLACE INTO games (id, name, release_date, rating) VALUES (?, ?, ?, ?)`
    
    DB.run(sql, [game.id, game.name, game.first_release_date, game.rating], function(err) {
        if (err) {
            console.log('Error adding game:', err)
        } else  
            {
            gamesCount++
            
            // Show progress every 1000 games
            if (gamesCount % 1000 === 0) {
                console.log('Processed ' + gamesCount + ' games...')
            }
         }
    } )
}

// Function to link game with genres
// Source: SQLite Tutorial. "SQLite Node.js: Inserting Data Into a Table." 
// SQLite Tutorial, https://www.sqlitetutorial.net/sqlite-nodejs/insert/. 
// Accessed 22 Sept. 2025.
//Source used for format for this function.
function linkGameGenres(gameId, genres) {
    if (genres && genres.length > 0) {
        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i]
            addGenre(genre.id, genre.name)
            
            const sql = `INSERT OR IGNORE INTO game_genres (game_id, genre_id) VALUES (?, ?)`
            DB.run(sql, [gameId, genre.id], function(err) {
                if (err) {
                    console.log('Error linking game to genre:', err)
                 }
            } )
            }
     }
}

// Function to link game with companies
function linkGameCompanies(gameId, companies) {
    if (companies && companies.length > 0) {
        for (let i = 0; i < companies.length; i++) {
            const company = companies[i]
            if (company.company) {
                addCompany(company.company.id, company.company.name)
                
                const sql = `INSERT OR IGNORE INTO game_companies (game_id, company_id) VALUES (?, ?)`
                DB.run(sql, [gameId, company.company.id], function(err) {
                    if (err) {
                        console.log('Error linking game to company:', err)
                    }
                }   )
             }
         }
    }
}

// Function to link the game with the platforms
function linkGamePlatforms(gameId, platforms) {
    if (platforms && platforms.length > 0) {
        for (let i = 0; i < platforms.length; i++) {
            const platform = platforms[i]
            addPlatform(platform.id, platform.name)
            
            const sql = `INSERT OR IGNORE INTO game_platforms (game_id, platform_id) VALUES (?, ?)`
            DB.run(sql, [gameId, platform.id], function(err) {
                if (err) {
                    console.log('Error linking game to platform:', err)
                    }
            }  )
        }
    }
}

// Process all the  games
console.log('Starting to process games...')

for (let i = 0; i < games.length; i++) {
    const game = games[i]
    
    // Add the game
    addGame (game)
    
    // Add relationships
    linkGameGenres (game.id, game.genres)
    linkGameCompanies (game.id, game.involved_companies)  
    linkGamePlatforms (game.id, game.platforms)
}

// Wait a bit then show the final results of the game
setTimeout(() => {
    console.log ('\\n=== Import Complete ===')
    console.log ('Games imported:', gamesCount)
    console.log ('Genres added:', genresCount)
    console.log ('Companies added:', companiesCount) 
    console.log ('Platforms added:', platformsCount)
    
    DB.close()
}, 5000 )
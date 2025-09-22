# Games Database Import

This directory contains scripts to import game data from the IGDB JSON export into a SQLite database.

## Database Schema

The database is designed with proper normalization to handle the rich game data:

### Tables Created:
- **games** - Main games table with id, name, release_date, rating
- **genres** - Game genres (Action, RPG, Strategy, etc.)
- **companies** - Game developers and publishers
- **platforms** - Gaming platforms (PC, PlayStation, Xbox, etc.)
- **game_genres** - Many-to-many relationship between games and genres
- **game_companies** - Many-to-many relationship between games and companies
- **game_platforms** - Many-to-many relationship between games and platforms

## Usage

### 1. Setup Database Schema
First, create the database tables:
```bash
npm run setup-db
```

### 2. Import Games Data
Import all games from GamesData.json:
```bash
npm run import-games
```

## Import Process Features

- **Batch Processing**: Processes games in batches of 1000 for better performance
- **Transaction Safety**: Uses database transactions for data integrity
- **Duplicate Handling**: Uses INSERT OR IGNORE/REPLACE to handle duplicates
- **Progress Tracking**: Shows real-time progress and processing rate
- **Error Handling**: Continues processing even if individual records fail
- **Caching**: Caches genre/company/platform IDs to avoid duplicate lookups
- **Foreign Key Support**: Properly maintains referential integrity

## Expected Import Stats

For the full IGDB dataset (~2.3M lines):
- Processing time: Estimated 10-30 minutes depending on hardware
- Games: ~200k+ individual games
- Genres: ~50+ unique genres
- Companies: ~10k+ companies
- Platforms: ~100+ platforms

## Database File Location

The SQLite database will be created at: `BackEnd/DB/games.db`

## Querying the Data

Example queries after import:

```sql
-- Get all games with their genres
SELECT g.name, GROUP_CONCAT(gr.name) as genres
FROM games g
JOIN game_genres gg ON g.id = gg.game_id
JOIN genres gr ON gg.genre_id = gr.id
GROUP BY g.id, g.name;

-- Find games by platform
SELECT g.name, g.rating
FROM games g
JOIN game_platforms gp ON g.id = gp.game_id
JOIN platforms p ON gp.platform_id = p.id
WHERE p.name = 'PC (Microsoft Windows)'
ORDER BY g.rating DESC;

-- Get company statistics
SELECT c.name, COUNT(gc.game_id) as game_count
FROM companies c
JOIN game_companies gc ON c.id = gc.company_id
GROUP BY c.id, c.name
ORDER BY game_count DESC
LIMIT 10;
```
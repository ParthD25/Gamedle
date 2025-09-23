# How to Import Games Data

This folder has scripts to put game data from GamesData.json into a database.

## What Tables Get Created:
- **games** - stores game info (id, name, release date, rating)
- **genres** - game types like Action, RPG, etc.
- **companies** - who made the games
- **platforms** - what systems games run on (PC, Xbox, etc.)
- **game_genres** - connects games to their genres
- **game_companies** - connects games to their companies  
- **game_platforms** - connects games to their platforms

## How to Run:

### Step 1: Make the database tables
```
npm run setup-db
```

### Step 2: Import all the games
```  
npm run import-games
```

## What it does:

- Reads all games from GamesData.json 
- Shows progress every 1000 games processed
- Handles errors without crashing
- Takes about 10-30 minutes to run

## Where is the database:

The database file will be at: `BackEnd/DB/games.db`

## Example database queries:

```sql
-- See all games
SELECT * FROM games LIMIT 10;

-- See games and their genres  
SELECT g.name, gr.name as genre
FROM games g
JOIN game_genres gg ON g.id = gg.game_id
JOIN genres gr ON gg.genre_id = gr.id;

-- Find PC games
SELECT g.name, g.rating
FROM games g
JOIN game_platforms gp ON g.id = gp.game_id  
JOIN platforms p ON gp.platform_id = p.id
WHERE p.name = 'PC (Microsoft Windows)';
```




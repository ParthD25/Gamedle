import {DB } from '../DB/connectDb.js'


//return the game of the day randomly selected 
export const getDailyGame = (req, res)=>{
    DB.get( 'SELECT * FROM games ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
        if (err) {
          //error handling for database issues
            console.error('Database error:', err)
              return res.status(500).send( { error: 'Database error' } )
        }
        if (!row) {
          //if no game found throw error

            return res.status(404).send( { error: 'No games found' } )
        }


        res.status(200).send(row)
    } )
}



//return a game based on the title
export const searchGameByTitle = (req, res) =>{
    const { title } = req.body

    if (!title || title.trim() === '') {
        return res.status(400).send({ error: 'Title is required ' })
    }
    DB.get(`
        SELECT
            g.id,
            g.name,
            g.release_date as first_release_date,
            g.rating,
            COALESCE(
                json_group_array(
                    DISTINCT json_object('id', gen.id, 'name', gen.name)
                ),
                '[]'
            ) as genres,
            COALESCE(
                json_group_array(
                    DISTINCT json_object('id', gc.company_id, 'company', json_object('id', comp.id, 'name', comp.name))
                ),
                '[]'
            ) as involved_companies
        FROM games g
        LEFT JOIN game_genres gg ON g.id = gg.game_id
        LEFT JOIN genres gen ON gg.genre_id = gen.id
        LEFT JOIN game_companies gc ON g.id = gc.game_id
        LEFT JOIN companies comp ON gc.company_id = comp.id
        WHERE g.name LIKE ?
        GROUP BY g.id, g.name, g.release_date, g.rating
        LIMIT 1
    `, [`%${title}%`], (err, row) => {
        // find games with partial title match
        console.log('Searching for:', title);
        if (err) {
            //handles error for database issues
            console.error('Database error:', err)
            return res.status(500).send({ error: 'Database error' });
        }
        if (!row) {
            //if no games were found throw an error
            console.log('No game found for:', title);
            return res.status(404).send({ error: 'Game not found' });
        }

        // Parse JSON arrays and filter out nulls
        try {
            const gameData = {
                ...row,
                genres: JSON.parse(row.genres).filter(g => g !== null),
                involved_companies: JSON.parse(row.involved_companies).filter(c => c !== null)
            };
            res.status(200).send(gameData);
        } catch (parseError) {
            console.error('Error parsing game data:', parseError);
            res.status(500).send({ error: 'Data parsing error' });
        }
    });
}


export const getRandomGame = (req, res) =>{
    DB.get(`
        SELECT
            g.id,
            g.name,
            g.release_date as first_release_date,
            g.rating,
            COALESCE(
                json_group_array(
                    DISTINCT json_object('id', gen.id, 'name', gen.name)
                ),
                '[]'
            ) as genres,
            COALESCE(
                json_group_array(
                    DISTINCT json_object('id', gc.company_id, 'company', json_object('id', comp.id, 'name', comp.name))
                ),
                '[]'
            ) as involved_companies
        FROM games g
        LEFT JOIN game_genres gg ON g.id = gg.game_id
        LEFT JOIN genres gen ON gg.genre_id = gen.id
        LEFT JOIN game_companies gc ON g.id = gc.game_id
        LEFT JOIN companies comp ON gc.company_id = comp.id
        GROUP BY RANDOM()
        LIMIT 1
    `, (err, row) => {
        // find games with partial title match
        if (err) {
            //handles error for database issues
            console.error('Database error:', err)
            return res.status(500).send({ error: 'Database error' });
        }
        if (!row) {
            //if no games were found throw an error
            return res.status(404).send({ error: 'Game not found' });
        }

        // Parse JSON arrays and filter out nulls
        try {
            const gameData = {
                ...row,
                genres: JSON.parse(row.genres).filter(g => g !== null),
                involved_companies: JSON.parse(row.involved_companies).filter(c => c !== null)
            };
            res.status(200).json(gameData);
        } catch (parseError) {
            console.error('Error parsing game data:', parseError);
            res.status(500).json({ error: 'Data parsing error' });
        }
    });
}



export const searchForFive = (req, res) => {
    console.log('searchForFive Route hit');
    const { title } = req.body;

    if (!title || title.trim() === '') {
        console.log('No Title');
        return res.status(400).send({ error: 'Title is required' });
    }

    DB.all(`
        SELECT
            g.id,
            g.name,
            g.release_date AS first_release_date,
            g.rating,
            COALESCE(
                json_group_array(
                    DISTINCT json_object('id', gen.id, 'name', gen.name)
                ),
                '[]'
            ) AS genres,
            COALESCE(
                json_group_array(
                    DISTINCT json_object('id', gc.company_id, 'company', json_object('id', comp.id, 'name', comp.name))
                ),
                '[]'
            ) AS involved_companies
        FROM games g
        LEFT JOIN game_genres gg ON g.id = gg.game_id
        LEFT JOIN genres gen ON gg.genre_id = gen.id
        LEFT JOIN game_companies gc ON g.id = gc.game_id
        LEFT JOIN companies comp ON gc.company_id = comp.id
        WHERE g.name LIKE ?
        GROUP BY g.id, g.name, g.release_date, g.rating
        LIMIT 5;
    `, [`%${title}%`], (err, rows) => {
        console.log('Searching for:', title);

        if (err) {
            console.error('Database error:', err);
            return res.status(500).send({ error: 'Database error' });
        }

        if (!rows || rows.length === 0) {
            console.log('No games found for:', title);
            return res.status(404).send({ error: 'No games found' });
        }

        try {
            const gamesData = rows.map(row => ({
                ...row,
                genres: JSON.parse(row.genres).filter(g => g !== null),
                involved_companies: JSON.parse(row.involved_companies).filter(c => c !== null)
            }));

            console.log(`Found ${gamesData.length} games`);
            console.log(gamesData)
            res.status(200).json(gamesData);
        } catch (parseError) {
            console.error('Error parsing game data:', parseError);
            res.status(500).send({ error: 'Data parsing error' });
        }
    });
};

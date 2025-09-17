import dotenv from 'dotenv'
import fs from 'fs'

const URL = 'https://id.twitch.tv/oauth2/token'
dotenv.config()

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

//Autheticate using Oauth2 as a Twitch Developer
const PostForTwitchAuthToken = async () => {
    try{
        const res = await fetch(URL,{
            method: 'POST',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id,
                client_secret,
                grant_type: 'client_credentials'
            })
        })
        if(!res.ok){
            console.log(`HTTP ERROR ${res.status}`)
        }
        const data = await res.json()
        return data
    } catch(error){
        console.error('Error (PostForTwitchAuthToken) while fetching Twitch Token', error)
    }
}
//Call IGDB api endpoint (POST)
const IGDB_URL = `https://api.igdb.com/v4/games`
const query = `fields id, name, first_release_date, genres.name, 
    involved_companies.company.name, aggregated_rating; where category = 0; limit 500;`

const fetchAllGamesData = async (token, offset) =>{
    try{
        const res = await fetch(IGDB_URL,{
            method: "POST",
            headers: {
                "Client-ID": client_id,
                "Authorization": `Bearer ${token}`
            },
            body: `${query}offset ${offset};`
        })
    
        if(!res.ok){
            console.log(`ERROR (fetchAllGamesData): HTTP Issues. Status: ${res.status}`)
        }

        const data = await res.json()
        saveGamesToFile(data)
        return data
    } catch(err){
        console.error('Error with fetch request', err)
    }
}

//save to JSON file
const saveGamesToFile = (games) =>{
    let allGames = []

    //if file exists, load existing games
    if(fs.existsSync('./GamesData.json')){
        const existingData = fs.readFileSync('./GamesData.json', 'utf-8')
        if(existingData.trim().length > 0){
            allGames = JSON.parse(existingData)
        }
    }

    allGames = [...allGames, ...games]

    const gamesAsJSON = JSON.stringify(allGames, null, 2)
    fs.writeFileSync('./GamesData.json', gamesAsJSON, 'utf-8')
}

//Fetches Games data from IGDB and saves to GamesData.json. (This is for only main games)
const twitchToken = await PostForTwitchAuthToken()
let returnedData = {}
let offset = 0
do{
    returnedData = await fetchAllGamesData(twitchToken.access_token, offset)
    offset+=500
}while(returnedData.length > 0)

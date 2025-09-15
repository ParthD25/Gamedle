import dotenv from 'dotenv'
const URL = 'https://id.twitch.tv/oauth2/token'
dotenv.config()

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

//Autheticate using Oauth2 as a Twtitch Developer
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
        console.log(`Twitch Token: ${data.access_token}`)
        console.log(`Expires In: ${data.expires_in}`)
        console.log(`Token Type: ${data.token_type}`)
    } catch(error){
        console.error('Error while fetching Twitch Token', error)
    }
}

PostForTwitchAuthToken()
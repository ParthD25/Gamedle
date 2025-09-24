import {type ApiGame } from "../src/models/Game"

const requestGameDataWithTitle = async (gameTitle: string): Promise<ApiGame | undefined>=>{
    const URL = 'http://localhost:3000/api/game/lookUpByTitle'
    const bodyData = {
        title: gameTitle
    }
    try{
        const response = await fetch(URL ,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bodyData)
        })
        const data = response.json()
        return data
    }catch(err){
        console.error(err)
    }
}



export { requestGameDataWithTitle }
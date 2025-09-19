import fs from 'fs'

const importGamesData = ()=>{
    let gamesData = []

    if(fs.existsSync('../GamesData.json')){
        let data = fs.readFileSync('../GamesData.json', 'utf-8')
        if(data.trim().length > 0){
            gamesData = JSON.parse(data)
        }
    }else{
        console.log(`GamesData.json does not exist!`)
        return
    }
    return gamesData
}

// const filteredGames = games.map((game, index) =>{
//     if()
// })

const isValidGame = (game) =>{
    if(!game.id || !game.name){
        return false
    }
    if(!game.genre || !game.first_release_date){
        return false
    }
    if(!game.)
    return true
}

const games = importGamesData()
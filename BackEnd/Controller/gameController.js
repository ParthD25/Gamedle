import Game from '../../FrontEnd/src/models/Game.ts'

//return the game of the day 
export const getDailyGame = (req, res)=>{
    const gameData =  getRandomGame()
  res.status(200).send(gameData)
}

//return a game based on the title
export const searchGameByTitle = (req, res) =>{
    const { title } = req.body
    //check if game exists
    const gameData = lookUpByTitle(title)
    //return if exists
        res.status(200).send(gameData)
    //error handling
}




//DB LookUps
const lookUpByTitle = title =>{
    const data = {
    "id": 47,
    "first_release_date": 1245715200,
    "genres": [
      {
        "id": 25,
        "name": "Hack and slash/Beat 'em up"
      },
      {
        "id": 31,
        "name": "Adventure"
      }
    ],
    "involved_companies": [
      {
        "id": 924,
        "company": {
          "id": 115,
          "name": "Codemasters"
        }
      },
      {
        "id": 923,
        "company": {
          "id": 163,
          "name": "Climax Studios"
        }
      }
    ],
    "name": "Overlord: Dark Legend",
    "platforms": [
      {
        "id": 5,
        "name": "Wii"
      }
    ]
  }
  return data
}




//UTILITY FUNCTIONS


//Return a random game
const getRandomGame = ()=>{
    const data = {
    "id": 2,
    "first_release_date": 912384000,
    "genres": [
      {
        "id": 13,
        "name": "Simulator"
      },
      {
        "id": 31,
        "name": "Adventure"
      }
    ],
    "involved_companies": [
      {
        "id": 7,
        "company": {
          "id": 4,
          "name": "Eidos Interactive"
        }
      },
      {
        "id": 6,
        "company": {
          "id": 3,
          "name": "Looking Glass Studios"
        }
      },
      {
        "id": 265431,
        "company": {
          "id": 1488,
          "name": "Activision Value"
        }
      }
    ],
    "name": "Thief: The Dark Project",
    "platforms": [
      {
        "id": 6,
        "name": "PC (Microsoft Windows)"
      }
    ],
    "rating": 86.63396922169207
  }
    return data
}
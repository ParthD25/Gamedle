

//return the game of the day 
export const getDailyGame = (req, res)=>{
    const gameData =  getRandomGame()
  res.status(200).send(gameData)
}






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
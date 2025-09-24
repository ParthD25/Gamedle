import { useEffect, useState } from 'react'
//Components:
// import SubmitGuess from "../components/SubmitGuess"
import GuessesLog from '../components/GuessesLog'
import Game from '../models/Game.ts'

function DailyGuess(){
    const [guessedGames, setGuessedGames] = useState<Game[]>([])

    //VVVV Experimental code - delete before pushing VVVVVV
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




  
  useEffect(()=>{
      const game1: Game = new Game(data)
    setGuessedGames(prev =>{
        return [...prev, game1]
    })
  }, [])



  //^^^^^ experimental code - delete before pushing ^^^^^




    return(
        <>
            <h3>Daily Game - Enter a game title</h3>
            {/* <SubmitGuess onSubmitGuess={setLog}/> */}
            <GuessesLog 
            games = {guessedGames}
            />
        </>
    )
}

export default DailyGuess
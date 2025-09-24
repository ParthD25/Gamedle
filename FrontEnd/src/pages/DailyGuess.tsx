import { useEffect, useState } from 'react'
//Components:
// import SubmitGuess from "../components/SubmitGuess"
import GuessesLog from '../components/GuessesLog'
import Game from '../models/Game.ts'

function DailyGuess(){
    const [guessedGames, setGuessedGames] = useState<Game[]>([])
    const [currentGuess, setCurrentGuess] = useState<Game | null>()

    //VVVV Experimental code - delete before pushing VVVVVV
    




  
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
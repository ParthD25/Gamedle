import { useEffect, useState } from 'react'
import { requestGameDataWithTitle } from '../../utils/apiFunctions.ts'
import SubmitGuess from "../components/SubmitGuess"
import GuessesLog from '../components/GuessesLog'
import Game from '../models/Game.ts'

function DailyGuess(){
    const [guessedGames, setGuessedGames] = useState<Game[]>([])
    const [currentGuess, setCurrentGuess] = useState<Game | null>(null)

    



 
    async function handleSubmitGuess(title:string){
        //Look up the game title that is in the text box 
        const returnedGame = await requestGameDataWithTitle(title)
        if(returnedGame === undefined){
            return
        }
        //update state to include the newly guessed game object
        const gameObject = new Game(returnedGame) 
        setCurrentGuess(gameObject)
    }

    //Update guessedGames to include the currentGuess
    useEffect(()=>{
        if(currentGuess){
            setGuessedGames((prev) =>{
                return(
                    [...prev,currentGuess]
                )
            })
        }
    }, [currentGuess])



    return(
        <>
            <h3>Daily Game - Enter a game title</h3>
            <SubmitGuess onSubmitGuess={handleSubmitGuess}/>
            <GuessesLog 
            games = {guessedGames}
            />
        </>
    )
}

export default DailyGuess
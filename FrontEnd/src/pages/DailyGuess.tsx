import { useEffect, useState } from 'react'
import { requestGameDataWithTitle } from '../../utils/apiFunctions.ts'
import SubmitGuess from "../components/SubmitGuess"
import GuessesLog from '../components/GuessesLog'
import Game from '../models/Game.ts'
import { getRandomGame } from '../../utils/apiFunctions.ts'
import './DailyGuess.css'

function DailyGuess(){
    const [guessedGames, setGuessedGames] = useState<Game[]>([])
    const [currentGuess, setCurrentGuess] = useState<Game | null>(null)
    const [guessCounter, setGuessCounter] = useState(0)
    const [isGameInProgress, setIsGameInProgress] = useState<Boolean>(false)
    const [targetGame, setTargetGame] = useState<Game|null>(null)

    //Get the Target Game from API
    useEffect(()=>{
        getRandomGame()
    },[])

 
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



    //Elements that will be rendered depending on state
    const infoForUserElement = (
        <h3 className='infoForUser'>Submit a Game Title to begin!</h3>
    )
    const guessCounterElement = (
        <h3>Gusses: {guessCounter}</h3>
    )

    return(
        <div className='dailyGuess-wrapper'>
            {isGameInProgress && guessCounterElement}
            {!isGameInProgress && infoForUserElement}
            <SubmitGuess onSubmitGuess={handleSubmitGuess}/>
            <GuessesLog 
            games = {guessedGames}
            />
        </div>
    )
}

export default DailyGuess
import { useEffect, useState } from 'react'
//Helper functions
import { requestGameDataWithTitle } from '../../utils/apiFunctions.ts'
import { getRandomGame } from '../../utils/apiFunctions.ts'
//Components
import SubmitGuess from "../components/SubmitGuess"
import GuessesLog from '../components/GuessesLog'
import Game from '../models/Game.ts'
//Styles
import './DailyGuess.css'

function DailyGuess(){
    const [guessedGames, setGuessedGames] = useState<Game[]>([])
    const [currentGuess, setCurrentGuess] = useState<Game | null>(null)
    const [guessCounter, setGuessCounter] = useState(0)
    const [isGameInProgress, setIsGameInProgress] = useState<boolean>(false)
    const [targetGame, setTargetGame] = useState<Game|null>(null)
    const [isGameOver, setIsGameOver] = useState<boolean>(false)
    const [isCorrectGameGuessed, setIsCorrectGameGuessed] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string|null>(null)

    //Get the Target Game from API
    useEffect(()=>{

        const fetchData = async () =>{
            try {
                const data = await getRandomGame()
                let gameObject = new Game(data)
                setTargetGame(gameObject)
            } catch (error) {
                console.log('Unable to setTargetGame');
                console.error(error);
            }
        }
        fetchData()
    },[])

    async function handleSubmitGuess(title:string){
        //if current guess is already picked, show error message
        if (!verifyCurrentGuessIsUnique(title)){
            setErrorMessage("That game has already been guessed")
            return
        }

        //Look up the game title that is in the text box 
        const returnedGame = await requestGameDataWithTitle(title)
        if(returnedGame === undefined){
            return
        }
        //update state to include the newly guessed game object
        const gameObject = new Game(returnedGame) 
        setCurrentGuess(gameObject)
        setIsGameInProgress(true)
        setGuessCounter(prev=>prev+1)
        setErrorMessage(null)
    }

    //Update guessedGames to include the currentGuess
    useEffect(()=>{
        if(currentGuess?.getTitle === targetGame?.getTitle()){
            setIsCorrectGameGuessed(true)
        }
        if(currentGuess){
            setGuessedGames((prev) =>{
                return(
                    [...prev,currentGuess]
                )
            })
        }
    }, [currentGuess])

    //Checks if max guesses are reached
    useEffect(()=>{
        if (guessCounter >= 2) {
            setIsGameOver(true)
        }
    }, [guessCounter])


    //Handling a Game Over State 
    useEffect(()=>{
        if(isCorrectGameGuessed){
            //code to update points
        }
    },[isGameOver])


    const handleReplay = () =>{
        window.location.reload()
    }

    //Create JSX for the correct gameOver element
    let gameOverElement
    if(isCorrectGameGuessed){
        gameOverElement = (
            <div className='gameOverMessage'>
                <p>Winner!</p>
                <button onClick={handleReplay}>Replay?</button>
            </div>
        )
    }else{
        gameOverElement = (
            <div className='gameOverMessage'>
                <p>You Lose.</p>
            </div>
        )
    }

    //Check if currentGuess is already in the list of guessed games
    const verifyCurrentGuessIsUnique = (guess: string): boolean =>{
        let isUnique = true
        guessedGames.forEach((game)=>{
            console.log(`Comparing: guess: ${guess} to title: ${game.getTitle()}`)
            if(guess === game.getTitle()){
                isUnique = false
            }
        })
        return isUnique
    }
   

    //Elements that will be rendered depending on state
    const infoForUserElement = (
        <h3 className='infoForUser'>Submit a Game Title to begin!</h3>
    )
    const guessCounterElement = (
        <h3 className='guesses'>Gusses: {guessCounter}/20</h3>
    )

    return(
        <div className='dailyGuess-wrapper'>
            {isGameOver && gameOverElement}
            {isGameInProgress && guessCounterElement}
            {!isGameInProgress && infoForUserElement}
            {<p className='errorMessage'>{errorMessage}</p>}
            <SubmitGuess onSubmitGuess={handleSubmitGuess}/>
            <GuessesLog 
            games = {guessedGames}
            />
        </div>
    )
}

export default DailyGuess
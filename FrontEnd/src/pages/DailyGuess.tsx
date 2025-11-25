import { useEffect, useState } from 'react'
//Helper functions
import { requestGameDataWithTitle } from '../../utils/apiFunctions.ts'
import { getRandomGame } from '../../utils/apiFunctions.ts'
//Components
import SubmitGuess from "../components/SubmitGuess"
import GuessesLog from '../components/GuessesLog'
import Leaderboard from '../components/Leaderboard'
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
    const MAXIMUM_NUMBER_OF_GUESSES = 20

    //Get the Target Game from API
    useEffect(()=>{

        const fetchData = async () =>{
            try {
                const data = await getRandomGame()
                const gameObject = new Game(data)
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
            setErrorMessage("That game has already been guessed. Try again!!")
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

    //Handle game state changes
    useEffect(() => {
        if (!currentGuess || !targetGame) return

        //Check if the current guess is correct
        if (currentGuess.getTitle() === targetGame.getTitle()) {
            console.log('🎉 WIN DETECTED! Target:', targetGame.getTitle(), 'Guess:', currentGuess.getTitle())
            setIsCorrectGameGuessed(true)
            setIsGameOver(true)

            //Submit score when game is won
            const score = Math.max(100 - (guessCounter * 5), 10)
            console.log('🏆 Calculating score:', score, 'for', guessCounter, 'guesses')
            submitScore(parseInt(targetGame.getId()), score, guessCounter)
            return
        }

        //Check if max guesses are reached
        if (guessCounter >= MAXIMUM_NUMBER_OF_GUESSES) {
            setIsGameOver(true)
            return
        }

        //Add current guess to the list of guessed games
        setGuessedGames(prev => [...prev, currentGuess])
    }, [currentGuess, targetGame, guessCounter])


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
                <button onClick={handleReplay}>Replay?</button>
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
        <h3 className='guesses'>Gusses: {guessCounter}/{MAXIMUM_NUMBER_OF_GUESSES}</h3>
    )

    const handleErrorMessage = (error: string)=>{
        setErrorMessage(error)
    }

    return(
        <div className='dailyGuess-wrapper'>
            <div className='main-content'>
                {isGameOver && gameOverElement}
                {isGameInProgress && guessCounterElement}
                {!isGameInProgress && infoForUserElement}
                {<p className='errorMessage'>{errorMessage}</p>}
                <SubmitGuess onSubmitGuess={handleSubmitGuess} errorMessageHandler={handleErrorMessage}/>
                <GuessesLog 
                games = {guessedGames}
                target = {targetGame}
                />
            </div>
            <div className='sidebar'>
                <Leaderboard />
            </div>
        </div>
    )
}


    // Submit score to leaderboard when game is completed
    const submitScore = async (gameId: number, finalScore: number, guessesUsed: number) => {
        try {
            const token = localStorage.getItem('token')
            console.log('📤 Submitting score:', { gameId, finalScore, guessesUsed })
            const response = await fetch('http://localhost:3000/api/leaderboard/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gameId,
                    score: finalScore,
                    guessesUsed
                })
            })
            
            if (response.ok) {
                console.log('✅ Score submitted successfully')
            } else {
                console.log('❌ Score submission failed:', response.status, response.statusText)
            }
        } catch (error) {
            console.error('💥 Failed to submit score:', error)
        }
    }
export default DailyGuess
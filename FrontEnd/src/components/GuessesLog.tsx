import Game from '../models/Game.ts'
import {type ReactElement } from 'react'
import './GuessesLog.css'

interface GuessesLogProps{
    games: Game[]
    target: Game|null
}

function GuessesLog({ games, target }: GuessesLogProps){

    const highlightCorrectLetters = (gameTitle:string, targetTitle:string): ReactElement=>{
        const guess = gameTitle
        const target = targetTitle

        let splitIndex = 0;

        const len = Math.min(guess.length, target.length);
        for (let i = 0; i < len; i++) {
            if (guess[i].toLowerCase() !== target[i].toLowerCase()) {
                splitIndex = i;
                break;
            }
            if (i === len - 1) splitIndex = len;
        }

        const correctPart = guess.slice(0, splitIndex);
        const firstDiff = guess[splitIndex] ?? "";
        const rest = guess.slice(splitIndex + 1);

        let arrow = "";
        const g = guess.toLowerCase();
        const t = target.toLowerCase();
        if (g < t) arrow = "↑";      
        else if (g > t) arrow = "↓"; 

        return (
            <div className="title-letter-highlight">
                {/* Correct letters in green */}t
                {correctPart && <span className="correct">{correctPart}</span>}

                {/* First mismatch in yellow */}
                {firstDiff && <span className="diff">{firstDiff}</span>}

                {/* Remaining letters in white */}
                {rest && <span className="rest">{rest}</span>}

                {/* Arrow indicator */}
                <span className="arrow">{arrow}</span>
            </div>
        );

    }
    

    //Generates the html elements for all guessed games
    const generateGuessedGamesTable = ():ReactElement=>{
        if (target){
            return(
            <tbody>
                {GuessedGamesTableElements(games, target)}
            </tbody>
            )
        }else{
            return(
                <></>
            )
        }
    }

    const GuessedGamesTableElements = (games: Game[], target:Game):ReactElement[]=>{
        const elements = games.map((item)=>{
            // Helper function to get arrow for string comparison (like old code style)
            const upOrDownArrow = (guessed: string[], target: string[]):string=>{
                let arrowSymbol = ""
                if (!guessed || !target || guessed.length === 0 || target.length === 0){
                    return ''
                }

                // Compare first items alphabetically 
                const guessedFirst = guessed[0].toLowerCase()
                const targetFirst = target[0].toLowerCase()

                if(guessedFirst > targetFirst){
                    arrowSymbol = "↓"  // Too high 
                }else if(guessedFirst < targetFirst){
                    arrowSymbol = "↑"  // Too low 
                }

                return arrowSymbol
            }
        
            return(
                <tr className='guessedGameRow' key={item.getId()}>
                    <td className='gameGuess-data'>{highlightCorrectLetters(item.getTitle(),target.getTitle())}</td>
                    <td className='gameGuess-data'>{item.getYear()}</td>
                    <td className='gameGuess-data'>{Array.isArray(item.getGenres()) ? item.getGenres().join(', ') : item.getGenres()}</td>
                    <td className='gameGuess-data'>
                        {Array.isArray(item.getCompanies()) ? item.getCompanies().join(', ') : item.getCompanies()}
                        {upOrDownArrow(item.getCompanies(), target.getCompanies())}
                    </td>
                    {/* <td className='gameGuess-data'>
                        {Array.isArray(item.getPlatforms()) ? item.getPlatforms().join(', ') : item.getPlatforms()}
                        {upOrDownArrow(item.getPlatforms(), target.getPlatforms())}
                    </td> */}
                    <td className='gameGuess-data'>{item.getRating()}</td>
                </tr>
            )
        })
        return elements
    }

    //Checks if Games has been passed or guessed
    const checkForGames = ()=>{
        if(!games || games.length === 0) return false
        else return true
    }
    return(
        <div className='guessesLog-container'>
            <table className='guesses-table'>
                <thead className='tableHead'>
                    <tr className='tablerow-label'>
                        <th className='guesses-label'>Title</th>
                        <th className='guesses-label'>Year</th>
                        <th className='guesses-label'>Genre</th>
                        <th className='guesses-label'>Companies</th>
                        {/* <th className='guesses-label'>Platforms</th> */}
                        <th className='guesses-label'>Rating</th>
                    </tr>
                </thead>
                {checkForGames() ? generateGuessedGamesTable() : 
                    <tbody><tr><td className='noGuess-data' colSpan={6}>No Guesses Yet!</td></tr></tbody>}
            </table>
        </div>
    )
}

export default GuessesLog
import Game from '../models/Game.ts'
import {type ReactElement } from 'react'
import './GuessesLog.css'

interface GuessesLogProps{
    games: Game[]
}

function GuessesLog({ games }: GuessesLogProps){
    

    //Generates the html elements for all guessed games
    const generateGuessedGamesTable = ():ReactElement=>{
        return(
        <tbody>
            {GuessedGamesTableElements(games)}
        </tbody>
        )
    }

    const GuessedGamesTableElements = (games: Game[]):ReactElement[]=>{
        let elements = games.map((item)=>{
            return(
                <tr className='guessedGameRow' key={item.getId()}>
                    <td className='gameGuess-data'>{item.getTitle()}</td>
                    <td className='gameGuess-data'>{item.getYear()}</td>
                    <td className='gameGuess-data'>{item.getGenres().join(', ')}</td>
                    <td className='gameGuess-data'>{item.getPlatforms().join(', ')}</td>
                    <td className='gameGuess-data'>{item.getCompanies().join(', ')}</td>
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
                        <th className='guesses-label'>Platform</th>
                        <th className='guesses-label'>Companies</th>
                        <th className='guesses-label'>Rating</th>
                    </tr>
                </thead>
                {checkForGames() ? generateGuessedGamesTable() : 
                    <tbody><tr><td className='noGuess-data'>No Guesses Yet!</td></tr></tbody>}
            </table>
        </div>
    )
}

export default GuessesLog
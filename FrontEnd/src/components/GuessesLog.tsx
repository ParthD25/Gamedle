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
            <tr>
                <td>{games[0].getTitle()}</td>
                <td>{games[0].getYear()}</td>
                <td>{games[0].getGenres()}</td>
                <td>{games[0].getPlatforms()}</td>
                <td>{games[0].getCompanies()}</td>
                <td>{games[0].getRating()}</td>
            </tr>
        </tbody>
        )
    }

    //Checks if Games has been passed or guessed
    const checkForGames = ()=>{
        if(!games || games.length === 0) return false
        else return true
    }
    return(
        <>
            <table >
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Year</th>
                        <th>Genre</th>
                        <th>Platform</th>
                        <th>Companies</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                {checkForGames() ? generateGuessedGamesTable() : 
                    <tbody><tr><td>No Guesses Yet!</td></tr></tbody>}
            </table>
        </>
    )
}

export default GuessesLog
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
                <tr key={item.getId()}>
                    <td>{item.getTitle()}</td>
                    <td>{item.getYear()}</td>
                    <td>{item.getGenres()}</td>
                    <td>{item.getPlatforms()}</td>
                    <td>{item.getCompanies()}</td>
                    <td>{item.getRating()}</td>
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
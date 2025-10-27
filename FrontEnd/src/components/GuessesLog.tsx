import Game from '../models/Game.ts'
import {type ReactElement } from 'react'
import './GuessesLog.css'

interface GuessesLogProps{
    games: Game[]
    target: Game|null
}

function GuessesLog({ games, target }: GuessesLogProps){
    

    //Generates the html elements for all guessed games
    const generateGuessedGamesTable = ():ReactElement=>{
        if (target){
            return(
            <tbody>
                {GuessedGamesTableElements(games,target)}
            </tbody>
            )
        }else{
            return(
                <></>
            )
        }
    }

    const GuessedGamesTableElements = (games: Game[], target:Game):ReactElement[]=>{
        let elements = games.map((item)=>{
            const isTitleEqual = item.getTitle() === target?.getTitle()
            const isYearEqual = item.getYear() === target?.getYear()
            const isRatingEqual = item.getRating() === target?.getRating()
            const genres = item.getGenres()
            const companies = item.getCompanies()
            const platforms = item.getPlatforms()

            const upOrDownArrow = (itemValue:string, targetValue:string):string=>{
                let arrowSymbol = ""
                const a = Number(itemValue)
                const b = Number(targetValue)
                if(targetValue === "Not Available" || itemValue === "Not Available"){
                    return '?'
                }
                if(a > b){
                    arrowSymbol = "↓"
                }else{
                    arrowSymbol = "↑"
                }

                return arrowSymbol
            }


            console.log(target)
            return(
                <tr className='guessedGameRow' key={item.getId()}>
                    <td className='gameGuess-data'>{item.getTitle()}</td>
                    <td className='gameGuess-data'>{item.getYear()}</td>
                    <td className='gameGuess-data'>{Array.isArray(item.getGenres()) ? item.getGenres().join(', ') : item.getGenres()}</td>
                    <td className='gameGuess-data'>{Array.isArray(item.getCompanies()) ? item.getCompanies().join(', ') : item.getCompanies()}</td>
                    <td className='gameGuess-data'>{Array.isArray(item.getPlatforms()) ? item.getPlatforms().join(', ') : item.getPlatforms()}</td>
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
                        <th className='guesses-label'>Platforms</th>
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
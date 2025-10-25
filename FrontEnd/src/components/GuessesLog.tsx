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
                    <td className={`gameGuess-data ${isTitleEqual ? 'equal' : ""}`}>
                        {item.getTitle()}
                    </td>
                    <td className={`gameGuess-data ${isYearEqual ? 'equal' : ""}`}>
                        {item.getYear()}
                        <span className='arrow'>
                            {upOrDownArrow(item.getYear(),target?.getYear())}
                        </span>
                    </td>
                    <td className='gameGuess-data'>
                        {genres.map((genre, index)=>{
                            const isMatching = target.getGenres().includes(genre)
                            return(
                                <span
                                    key={index}
                                    className={isMatching ? "equal" : ""}
                                >
                                    {genre}
                                    {index < genres.length - 1 && ', '}
                                </span>
                            )
                        })}
                    </td>
                    <td className='gameGuess-data'>
                        {platforms.map((platform, index)=>{
                            const isMatching = target.getPlatforms().includes(platform)
                            return(
                                <span
                                    key={index}
                                    className={isMatching ? "equal" : ""}
                                >
                                    {platform}
                                    {index < platforms.length - 1 && ', '}
                                </span>
                            )
                        })}
                    </td>
                    <td className='gameGuess-data'>
                        {companies.map((company, index)=>{
                            const isMatching = target.getCompanies().includes(company)
                            return(
                                <span
                                    key={index}
                                    className={isMatching ? "equal" : ""}
                                >
                                    {company}
                                    {index < companies.length - 1 && ', '}
                                </span>
                            )
                    })}
                    </td>
                    <td className={`gameGuess-data ${isRatingEqual ? 'equal' : ""}`}>
                        {item.getRating()}
                        <span className='arrow'>
                            {upOrDownArrow(item.getRating(),target?.getRating())}
                        </span>
                    </td>
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
import { useState } from 'react'
//Components:
import SubmitGuess from "../components/SubmitGuess"
import GuessesLog from '../components/GuessesLog'

function DailyGuess(){
    const [log, setLog] = useState('')

    return(
        <>
            <h3>Daily Game - Enter a game title</h3>
            <SubmitGuess onSubmitGuess={setLog}/>
            <text id="Logger">{log}</text>
            <GuessesLog/>
        </>
    )
}

export default DailyGuess
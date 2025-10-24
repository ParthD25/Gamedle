import { useState } from 'react'
import './SubmitGuess.css'
import Suggestions from './Suggestions'


interface SubmitGuessProps{
    onSubmitGuess: (val: string) => void
}

function SubmitGuess( { onSubmitGuess } : SubmitGuessProps){
    const [input, setInput] = useState("")

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setInput(e.target.value)
    }

   
    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault()
        const value = input.trim()
        if(!value) return
        onSubmitGuess(value) //Lifts input state back up
        setInput("")
    }

    return(
        <div className="submitGuess-container">
            <form className='inputForm' onSubmit={handleSubmit}>
                <input
                    className='inputForm-inputBox'
                    value={input}
                    onChange={handleChange}
                />
                <button>Submit</button>
            </form>
            <Suggestions />
        </div>
    )
}

export default SubmitGuess
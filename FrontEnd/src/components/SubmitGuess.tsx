import { useEffect, useState } from 'react'
import './SubmitGuess.css'
import Suggestions from './Suggestions'
import { getFiveSuggestions } from '../../utils/apiFunctions'


interface SubmitGuessProps{
    onSubmitGuess: (val: string) => void
}

function SubmitGuess( { onSubmitGuess } : SubmitGuessProps){
    const [suggestions, setSuggestions] = useState<string[]|[]>([])
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

    //calls API endpoint to receive up to 5 possible title names
    useEffect(()=>{
        if (input.trim() === "" || input === null){
            return
        }
        const fetchData = async ()=>{
            try {
                const data = await getFiveSuggestions(input)
                setSuggestions(data)
            } catch (error) {
                console.log("Unable to receive 5 suggestions")
                console.error(error)
            }
        }
        fetchData()
    }, [input])

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
            <Suggestions listOfTitles={suggestions}/>
        </div>
    )
}

export default SubmitGuess
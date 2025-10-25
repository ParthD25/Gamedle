import { useEffect, useState } from 'react'
import './SubmitGuess.css'
import Suggestions from './Suggestions'
import { getFiveSuggestions } from '../../utils/apiFunctions'


interface SubmitGuessProps{
    onSubmitGuess: (val: string) => void
    errorMessageHandler: (val: string) => void
}

function SubmitGuess( { onSubmitGuess, errorMessageHandler } : SubmitGuessProps){
    const [suggestions, setSuggestions] = useState<string[]|[]>([])
    const [input, setInput] = useState("")

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setInput(e.target.value)
    }

   
    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault()
        const value = input.trim()
        
        if(!value) return

        //Does input match a suggestion
        if(!isTitleSuggested(value)){
            errorMessageHandler("Please click on one of the suggestions.")
            setInput("")
            return
        }


        onSubmitGuess(value) //Lifts input state back up
        setInput("")
    }

    const isTitleSuggested = (title: string): boolean=>{
        let isValid = false
        suggestions.forEach(gameTitle =>{
            if (gameTitle.trim() === title){
                isValid = true
            }
        })
        return isValid
    }

    const handleSuggestionClick = (title: string)=>{
        setInput(title)
    }

    //calls API endpoint to receive up to 5 possible title names
    useEffect(()=>{
        if (input.trim() === "" || input === null){
            setSuggestions([])
            return
        }
        const fetchData = async ()=>{
            try {
                const data = await getFiveSuggestions(input)
                setSuggestions(data)
            } catch (error) {
                console.log("Unable to receive 5 suggestions")
                setSuggestions([])
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
            <Suggestions 
                handleSuggestionClick={handleSuggestionClick}
                listOfTitles={suggestions}
            />
        </div>
    )
}

export default SubmitGuess
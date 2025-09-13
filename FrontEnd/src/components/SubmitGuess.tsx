import { useState } from 'react'

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
        <form onSubmit={handleSubmit}>
         <input
            value={input}
            onChange={handleChange}
        />
         <button>Submit</button>
        </form>
    )
}

export default SubmitGuess
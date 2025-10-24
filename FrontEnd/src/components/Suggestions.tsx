import type { ReactNode } from 'react'
import './Suggestions.css'

interface SuggestionProps{
    listOfTitles: string[]
}


function Suggestions({ listOfTitles }: SuggestionProps){

    console.log(listOfTitles)


    const titleSuggestionElements = ():ReactNode =>{
        let elements: ReactNode = listOfTitles.map((title, index)=>{
            return(
                <p className='listItem' key={index}>{title}</p>
            )
        })
        return elements
    }

    return(
        <div className="suggestions-wrapper">
            {titleSuggestionElements()}
        </div>
    )
}


export default Suggestions
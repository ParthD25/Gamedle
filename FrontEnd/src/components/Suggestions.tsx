import type { ReactNode } from 'react'
import './Suggestions.css'

interface SuggestionProps{
    listOfTitles: string[]
    handleSuggestionClick: (val: string)=>void
}


function Suggestions({ listOfTitles, handleSuggestionClick }: SuggestionProps){


    const handleClick = (e: React.MouseEvent<HTMLElement>)=>{
        const title = e.currentTarget.dataset.title
        if(title){
            handleSuggestionClick(title)
        }
    }

    const titleSuggestionElements = ():ReactNode =>{
        let elements: ReactNode = listOfTitles.map((title, index)=>{
            return(
                <p data-title={title} onClick={handleClick} className='listItem' key={index}>{title}</p>
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
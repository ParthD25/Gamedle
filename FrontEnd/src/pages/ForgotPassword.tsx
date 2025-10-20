import { useState } from "react"
import './ForgotPassword.css'

function ForgotPassword(){
    const [email, setEmail] = useState<string>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { value } = e.target
        setEmail(value)
    }

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault()
        console.log("SERVER OFFLINE")
        console.log(email)
    }


    return(
        <div className="forgotPassword-wrapper">
            <h2>Reset Your Password</h2>
            <div className="reset-wrapper">
                <p>Enter your email address to reset your password:</p>
                <form className="reset-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="email"
                        value={email}
                        onChange={handleChange}
                        required 
                        />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
import { useState } from "react"

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
        <>
            <h2>Reset Your Password</h2>
            <div>
                <p>Enter your email address to reset your password:</p>
                <form onSubmit={handleSubmit}>
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
        </>
    )
}

export default ForgotPassword
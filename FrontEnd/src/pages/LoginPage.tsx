import { useState } from "react"
import { Link } from "react-router-dom"
import './LoginPage.css'


interface emailAndPassword{
    email: string,
    password: string
}

function LoginPage(){

    let [emailAndPassword, setEmailAndPassword] = useState<emailAndPassword>({
        email: "",
        password: ""
    })

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault()
        // @post api/users/user -- Check if User exists and if password matches
        console.log(emailAndPassword)
        console.log("UNABLE TO VERIFY IDENTITY --- SERVER OFFLINE")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target
        setEmailAndPassword(prev =>({
            ...prev,
            [name]:value
        }))
    }

    return(
        <div className="login-wrapper">
            <h2>Login to Gamedle</h2>
            <form className="credentials-form" onSubmit={handleSubmit}>
                <input
                    className="credentials-input"
                    type="text" 
                    name="email"
                    value={emailAndPassword.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />                
                <input
                    className="credentials-input"
                    type="text" 
                    name="password"
                    value={emailAndPassword.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button>Log In</button>
            </form>
            <div>
                <Link to='/forgotPassword'>
                    <p>Forgot Password?</p>
                </Link>
            </div>
        </div>
    )
}


export default LoginPage
import { Link } from "react-router-dom"
import { useState } from "react"
import { signUpUser } from '../../utils/apiFunctions'
import './SignUpPage.css'

interface Credentials{
    email: string,
    username: string,
    password1: string,
    password2: string
}

function SignUpPage(){
    let [didUserSignUp, setDidUserSignUp] = useState(false)
    let [credentials, setCredentials] = useState<Credentials>({
        email: "",
        username: "",
        password1: "",
        password2: ""
    })



    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()

        //Check for matching password
        if(credentials.password1 !== credentials.password2){
            console.log("PASSWORDS ARE NOT MATCHING")
            return
        }

        try {
            const data = await signUpUser(credentials.email, credentials.password1)
            console.log(data) //Token is logged
            localStorage.setItem("token", data.token)
            setDidUserSignUp(true)
        } catch (error) {
            console.log("Problem when attempting to sign up user")
            console.error(error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target
        setCredentials((prev) =>({
            ...prev,
            [name]:value
        }))
    }

    let signedUpUserElement = (
            <div className="userSignedUp-wrapper">
                <p>Sign up Successful!</p>
                <Link to={'/DailyGuess'}><button className="btnToPlay">Play Daily Guess</button></Link>
            </div>
    )

    return(
        <div className="signup-wrapper">
            {didUserSignUp && signedUpUserElement}
            <h2>Sign up to Gamedle</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input 
                    className="credentials-input"
                    type="email"
                    name="email"
                    value={credentials.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    className="credentials-input"
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    className="credentials-input"
                    type="password"
                    name="password1"
                    value={credentials.password1}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    className="credentials-input"
                    type="password"
                    name="password2"
                    value={credentials.password2}
                    onChange={handleChange}
                    placeholder="Re-enter Password"
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <div className="prevAccountwrapper">
                <p>Already have an account?</p> 
                <Link to='/login'>
                    <p>Log In</p>
                </Link>
            </div>
        </div>
    )
}

export default SignUpPage
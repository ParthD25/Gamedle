import { Link } from "react-router-dom"
import { useState } from "react"
import './SignUpPage.css'

interface Credentials{
    email: string,
    username: string,
    password1: string,
    password2: string
}

function SignUpPage(){

    let [credentials, setCredentials] = useState<Credentials>({
        email: "",
        username: "",
        password1: "",
        password2: ""
    })



    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault()
        //check for email and username is not taken



        //Check for matching password
        if(credentials.password1 !== credentials.password2){
            console.log("PASSWORDS ARE NOT MATCHING")
            return
        }

        // post api/users/createUser
        console.log("Unable to create user - server unavailable")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target
        setCredentials((prev) =>({
            ...prev,
            [name]:value
        }))
    }

    return(
        <>
            <h2>SignUp Page</h2>
            <form className="form-wrapper" onSubmit={handleSubmit}>
                <input 
                    type="email"
                    name="email"
                    value={credentials.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password1"
                    value={credentials.password1}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="password"
                    name="password2"
                    value={credentials.password2}
                    onChange={handleChange}
                    placeholder="Re-enter Password"
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <div>
                <p>Already have an account?</p> 
                <Link to='/login'>
                    <p>Log In</p>
                </Link>
            </div>
        </>
    )
}

export default SignUpPage
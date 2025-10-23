import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { register } from '../../utils/apiFunctions'
import { useAuth } from '../context/AuthContext'
import './SignUpPage.css'

interface Credentials{
    email: string,
    username: string,
    password1: string,
    password2: string
}

function SignUpPage(){
    const [error, setError] = useState<string | null>(null);
    let [credentials, setCredentials] = useState<Credentials>({
        email: "",
        username: "",
        password1: "",
        password2: ""
    })
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()
        if(credentials.password1 !== credentials.password2){
            setError("Passwords do not match");
            return;
        }
        setError(null);

        try {
            const response = await register(credentials.email, credentials.username, credentials.password1);
            if (response && response.token) {
                const user = response.user ?? { email: credentials.email, username: credentials.username }
                authLogin(response.token, { email: user.email, username: user.username });
                navigate('/');
            } else {
                setError('Registration failed');
            }
        } catch (err) {
            if (err instanceof Error) setError(`Registration failed: ${err.message}`)
            else setError("Failed to register. Please try again.");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target
        setCredentials((prev) =>({
            ...prev,
            [name]:value
        }))
    }

    return(
        <div className="signup-wrapper">
            <h2>Sign up to Gamedle</h2>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
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
                    minLength={6}
                />
                <input
                    className="credentials-input"
                    type="password"
                    name="password2"
                    value={credentials.password2}
                    onChange={handleChange}
                    placeholder="Re-enter Password"
                    required
                    minLength={6}
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
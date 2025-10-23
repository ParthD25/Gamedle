import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import './LoginPage.css'
import { login } from "../../utils/apiFunctions"
import { useAuth } from '../context/AuthContext'


interface emailAndPassword{
    email: string,
    password: string
}

function LoginPage(){
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);
    let [emailAndPassword, setEmailAndPassword] = useState<emailAndPassword>({
        email: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()
        setError(null)
        try {
            const { token, user } = await login(emailAndPassword.email, emailAndPassword.password)
            const info = user ?? { email: emailAndPassword.email }
            authLogin(token, { email: info.email, username: info.username })
            navigate('/')
        } catch (err) {
            if (err instanceof Error) setError(err.message)
            else setError('Login failed. Please try again.')
        }
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
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form className="credentials-form" onSubmit={handleSubmit}>
                <input
                    className="credentials-input"
                    type="email" 
                    name="email"
                    value={emailAndPassword.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />                
                <input
                    className="credentials-input"
                    type="password" 
                    name="password"
                    value={emailAndPassword.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    minLength={6}
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
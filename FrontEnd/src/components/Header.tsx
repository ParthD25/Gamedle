import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

// Sources:
// - React Docs. “Function components; conditional rendering; fragments.” Accessed 23 Oct. 2025.
// - AI assistance: Portions drafted with OpenAI ChatGPT (GPT-5 Thinking), verified and adapted by the author for correctness.
// Accessed 23 Oct. 2025.
export const Header = () => {
    const { isAuthenticated, userInfo, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const atHome = location.pathname === '/';

    return (
        <header className="header">
            <div className="header-content">
                <div className="left-section">
                    {!atHome && (
                        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                            ← Back
                        </button>
                    )}
                </div>
                <Link to='/'>
                    <h1 className="logo">Gamedle</h1>
                </Link>
                <div className="user-section">
                    {isAuthenticated && userInfo ? (
                        <>
                            <span className="welcome-message">Welcome, {userInfo.username || 'Player'}!</span>
                            <Link to="/profile" className="auth-link">Edit Profile</Link>
                            <button onClick={logout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-link">Login</Link>
                            <Link to="/signup" className="auth-link">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
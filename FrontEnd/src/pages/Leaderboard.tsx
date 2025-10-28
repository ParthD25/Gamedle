import { useState, useEffect } from 'react'
import './Leaderboard.css'

// Interface defining the structure of each leaderboard entry from the API
interface LeaderboardEntry {
    username: string
    games_completed: number
    avg_guesses: number
    best_score: number
}

function Leaderboard() {
    // State for storing leaderboard data, loading status, and error messages
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

//autorefresh
    useEffect(() => {
        fetchLeaderboard()

        const interval = setInterval(fetchLeaderboard, 300000)//leaderboard update 
        return () => clearInterval(interval)
    }, [])

    // Function to fetch data from the backend API to leaderboard 
    const fetchLeaderboard = async () => {
        try {
            setError(null)
            const response = await fetch('http://localhost:3000/api/leaderboard')
            if (response.ok) {
                const data = await response.json()
                setLeaderboard(data)
            } else {
                setError('Failed to load leaderboard')
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
            setError('Failed to load leaderboard')
        } finally {
            setLoading(false)
        }
    }

    // Show loading state while fetching data
    if (loading) {
        return (
            <div className="leaderboard">
                <h3>🏆 Leaderboard 🏆</h3>
                <div className="loading">Loading...</div>
            </div>
        )
    }

    // Show error state if API call fails
    if (error) {
        return (
            <div className="leaderboard">
                <h3>🏆 Leaderboard 🏆</h3>
                <div className="error">{error}</div>
            </div>
        )
    }

    // Main render: display leaderboard with rankings
    return (
        <div className="leaderboard">
            <h3>🏆 Leaderboard 🏆</h3>
            <div className="leaderboard-list">
                {leaderboard.length === 0 ? (
                    // Message shown when no scores exist yet
                    <div className="no-data">No scores yet! Play some games to see rankings.</div>
                ) : (
                    // Map through leaderboard entries and display each player's stats
                    leaderboard.map((entry, index) => (
                        <div key={index} className="leaderboard-entry">
                            <span className="rank">#{index + 1}</span>
                            <span className="username">{entry.username}</span>
                            <span className="stats">
                                {entry.games_completed} games • {entry.best_score} pts
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Leaderboard


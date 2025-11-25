import { useState, useEffect } from 'react'
import './Leaderboard.css'

interface LeaderboardEntry {
    username: string
    games_completed: number
    avg_guesses: number
    best_score: number
}

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeaderboard()
        // Update every 30 seconds
        const interval = setInterval(fetchLeaderboard, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/leaderboard')
            if (response.ok) {
                const data = await response.json()
                setLeaderboard(data)
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="leaderboard">Loading...</div>

    return (
        <div className="leaderboard">
            <h3>🏆 Leaderboard</h3>
            <div className="leaderboard-list">
                {leaderboard.length === 0 ? (
                    <div className="no-data">No scores yet!</div>
                ) : (
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
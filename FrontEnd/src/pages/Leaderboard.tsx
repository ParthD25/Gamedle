import { useState, useEffect } from 'react'
import './Leaderboard.css'
import { getLeaderboard as fetchLeaderboardData } from '../../utils/apiFunctions'

// Interface defining the structure of each leaderboard entry from the API
interface LeaderboardEntry {
    username?: string
    gamesPlayed: number
    bestScore: number
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

    // Function to fetch data from Firestore via Firebase services
    const fetchLeaderboard = async () => {
        try {
            setError(null)
            const data = await fetchLeaderboardData()
            // Map to UI shape
            const mapped: LeaderboardEntry[] = data.map((u: any) => ({
                username: u.username || u.email?.split('@')[0],
                gamesPlayed: u.gamesPlayed || 0,
                bestScore: u.bestScore || 0
            }))
            setLeaderboard(mapped)
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
                                {entry.gamesPlayed} games • {entry.bestScore} pts
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Leaderboard


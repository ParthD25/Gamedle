import { useState, useEffect } from 'react'
import './Leaderboard.css'
import { getLeaderboard as fetchLeaderboardData } from '../../utils/apiFunctions'

interface LeaderboardEntry {
    username?: string
    gamesPlayed: number
    bestScore: number
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
            const data = await fetchLeaderboardData()
            const mapped: LeaderboardEntry[] = data.map((u: any) => ({
                username: u.username || u.email?.split('@')[0],
                gamesPlayed: u.gamesPlayed || 0,
                bestScore: u.bestScore || 0
            }))
            setLeaderboard(mapped)
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
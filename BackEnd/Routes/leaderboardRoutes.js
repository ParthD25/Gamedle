import express from 'express'
import {getLeaderboard, submitScore} from '../Controller/leaderboardController.js'
import {authenticateToken} from '../middleware/auth.js'

const router = express.Router()
// Public route to get the leaderboard
router.get('/', getLeaderboard)
// Protected route which requires authentication to submit/add scores
router.post('/submit', authenticateToken, submitScore)

export default router
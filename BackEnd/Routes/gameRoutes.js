import { Router } from "express"
import { getDailyGame, searchGameByTitle } from "../Controller/gameController.js"


const router = Router()

// GET /api/game/
router.get('/daily',getDailyGame)

//POST /api/game/:title
router.post('/:title', searchGameByTitle)

export default router
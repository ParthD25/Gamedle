import { Router } from "express"
import { getDailyGame, searchGameByTitle } from "../Controller/gameController.js"


const router = Router()

// GET /api/game/daily
router.get('/daily',getDailyGame)

//POST /api/game/lookUpByTitle
router.post('/lookUpByTitle', searchGameByTitle)

export default router
import { Router } from "express"
import { getDailyGame } from "../Controller/gameController.js"


const router = Router()

// GET /api/game/
router.get('/daily',getDailyGame)


export default router
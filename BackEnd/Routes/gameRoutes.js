import { Router } from "express"
import { getDailyGame, searchGameByTitle, getRandomGame, searchForFive } from "../Controller/gameController.js"


const router = Router()

// GET /api/game/daily - Returns a random game that is set by the day
router.get('/daily',getDailyGame)

//POST /api/game/lookUpByTitle - Look up game by title
router.post('/lookUpByTitle', searchGameByTitle)

//POST /api/game/receiveFiveSuggestions - Look up game by title
router.post('/receiveFiveSuggestions', searchForFive)

//Get /api/game/getRandomGame - returns a random game
router.get('/getRandomGame', getRandomGame)

export default router
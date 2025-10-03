import { Router } from "express";
import {
    findUserByEmail,
    signUpUser,
    loginUserByEmail,
    updatePassword,
    deleteUserByEmail
} from "../Controller/userController.js"

const router = Router()


// POST /api/users/user - Find User in DB by email
router.post('/user', findUserByEmail)

//POST /api/users/signUpUser - Create a user profile 
router.post('/signUpUser', signUpUser)

//PUT /api/users/loginUser - Log in User by Email
router.put('/loginUser', loginUserByEmail)

//PUT /api/users/updatePassword - Update the user's password
router.put('/updatePassword', updatePassword)

//DELETE /api/users/deleteUser - Delete the user's profile
router.delete('/deleteUser', deleteUserByEmail)

export default router
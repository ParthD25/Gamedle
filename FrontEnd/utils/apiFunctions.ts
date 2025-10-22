import {type ApiGame } from "../src/models/Game"



export const requestGameDataWithTitle = async (gameTitle: string): Promise<ApiGame | undefined>=>{
    const URL = 'http://localhost:3000/api/game/lookUpByTitle'
    const bodyData = {
        title: gameTitle
    }
    try{
        const response = await fetch(URL ,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bodyData)
        })
        const data = response.json()
        return data
    }catch(err){
        console.error(err)
    }
}

const API = "http://localhost:3000/api/users"

export async function register(email: string, password: string) {
    const res = await fetch(`${API}/signUpUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error("Failed to register")
    }
    return res.json()
}

// Login
export async function login(email: string, password: string) {
    const res = await fetch(`${API}/loginUser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error("Invalid login")
    }
    return res.json() // will contain { token }
}

// Find user
export async function getUser(email: string) {
    const res = await fetch(`${API}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })

    if (!res.ok) {
        throw new Error("User not found")
    }
    return res.json()
}

// Sign up user
export async function signUpUser(email: string, password: string) {
    const res = await fetch(`${API}/signUpUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error("Unable to Sign up user")
    }
    return res.json()
}





const GAMESAPI = 'http://localhost:3000/api/game'
//Methods for Game API
export async function getRandomGame(){
    try{
        const res = await fetch(`${GAMESAPI}/getRandomGame`,{
            method: "GET",
            headers: { "Content-Type": "application/json"}
        })
        const data = await res.json()

        console.log(data)
    }catch(error){
        console.log("Unable to get random game")
        console.error(error)
    }
}
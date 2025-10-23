import { type ApiGame } from "../src/models/Game"

const BASE = 'http://localhost:3000'
const API = `${BASE}/api/users`
const GAME_API = `${BASE}/api/game`



export const requestGameDataWithTitle = async (gameTitle: string): Promise<ApiGame | undefined> => {
    const URL = `${GAME_API}/lookUpByTitle`
    const bodyData = { title: gameTitle }
    const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
    })
    if (!response.ok) throw new Error('Failed to fetch game data')
    return response.json()
}

export async function register(email: string, username: string, password: string) {
    const res = await fetch(`${API}/signUpUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password })
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Registration failed')
    }
    return res.json() // { token, user }
}

// Login
export async function login(email: string, password: string) {
    const res = await fetch(`${API}/loginUser`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Invalid login')
    }
    return res.json() // { token, user }
}

// Find user
export async function getUser(email: string) {
    const res = await fetch(`${API}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })

    if (!res.ok) throw new Error("User not found")
    return res.json()
}

export async function getCurrentUser(token: string) {
    const res = await fetch(`${API}/me`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to get current user')
    }
    return res.json() as Promise<{ id: number; email: string; username?: string }>
}

export async function updateUsername(token: string, username: string) {
    const res = await fetch(`${API}/username`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to update username')
    }
    return res.json() as Promise<{ success: boolean; token: string; user: { id: number; email: string; username: string } }>
}





const GAMESAPI = `${BASE}/api/game`
// Methods for Game API
export async function getRandomGame(){
    const res = await fetch(`${GAMESAPI}/getRandomGame`,{
        method: "GET",
        headers: { "Content-Type": "application/json"}
    })
    if (!res.ok) throw new Error('Unable to get random game')
    return res.json()
}
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "SECRET"

export const authenticateToken = (req, res, next) => {
    console.log(' Auth middleware: checking token')
    const authHeader = req.headers['authorization']
    console.log(' Auth header:', authHeader)
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
    console.log(' Extracted token:', token)
    console.log(' Full token value:', token)

    if (!token) {
        console.log(' No token provided')
        return res.status(401).send({ error: 'Access token required' })
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log(' Token verification failed:', err.message)
            return res.status(403).send({ error: 'Invalid token' })
        }
        console.log(' Token verified for user:', user)
        req.user = user
        next()
    })
}

//this function checks if user is logged in
//it uses jwt tokens for authentication
//returns error if no token or invalid token
//otherwise continues to next middleware
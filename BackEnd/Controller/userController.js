import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { DB } from "../DB/connectDb.js"

// Register
export const signUpUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" })
    }
    
    const hashedPassword = await bcrypt.hash(password,10)
    
    DB.run(`INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword],
        function (err) {
            if (err) {
                console.log(err)
                return res.status(400).json({ error: "User already exists" })
            }
            console.log("User Created")
            const token = jwt.sign({ id: this.lastID, email }, "SECRET", { expiresIn: "1h" })
            console.log(`Token created: ${token}`)
            return res.status(201).json({ token })
    })

}

// Login
export const loginUserByEmail = (req, res) => {
    const { email, password } = req.body

    DB.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const isValid = bcrypt.compareSync(password, row.password)
        if (!isValid) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign({ id: row.id, email: row.email }, "SECRET", { expiresIn: "1h" })
        res.json({ token })
    })
}

// Find User
export const findUserByEmail = (req, res) => {
    const { email } = req.body
    DB.get(`SELECT id, email, created_at FROM users WHERE email = ?`, [email], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: "User not found" })
        }
        res.json(row)
    })
}

// Delete
export const deleteUserByEmail = (req, res) => {
    const { email } = req.body
    DB.run(`DELETE FROM users WHERE email = ?`, [email], function (err) {
        if (err) {
            return res.status(500).json({ error: "Failed to delete user" })
        }
        res.json({ deleted: this.changes })
    })
}

// Update password
export const updatePassword = (req, res) => {
    const { email, newPassword } = req.body
    const hashedPassword = bcrypt.hashSync(newPassword, 10)

    DB.run(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email], function (err) {
        if (err) {
            return res.status(500).json({ error: "Failed to update password" })
        }
        res.json({ updated: this.changes })
    })
}
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { DB } from "../DB/connectDb.js"

const JWT_SECRET = process.env.JWT_SECRET || "SECRET"

// Register
export const signUpUser = async (req, res) => {
    const { email, password, username } = req.body
    if (!email || !password || !username) {
        return res.status(400).json({ error: "Email, password, and username are required" })
    }
    const hashedPassword = await bcrypt.hash(password,10)
    DB.run(`INSERT INTO users (email, password, username) VALUES (?, ?, ?)`,
        [email, hashedPassword, username],
        function (err) {
            if (err) return res.status(400).json({ error: "User already exists" })
            const token = jwt.sign({ id: this.lastID, email, username }, JWT_SECRET, { expiresIn: "1h" })
            return res.status(201).json({ token, user: { id: this.lastID, email, username } })
    })
}

// Login
export const loginUserByEmail = (req, res) => {
    const { email, password } = req.body

    DB.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err || !row) return res.status(400).json({ error: "Invalid credentials" })

        const isValid = bcrypt.compareSync(password, row.password)
        if (!isValid) return res.status(400).json({ error: "Invalid credentials" })

        const token = jwt.sign({ id: row.id, email: row.email, username: row.username }, JWT_SECRET, { expiresIn: "1h" })
        res.json({ token, user: { id: row.id, email: row.email, username: row.username } })
    })
}

// Find User
export const findUserByEmail = (req, res) => {
    const { email } = req.body
    DB.get(`SELECT id, email, username, created_at FROM users WHERE email = ?`, [email], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "User not found" })
        res.json(row)
    })
}

// Delete
export const deleteUserByEmail = (req, res) => {
    const { email } = req.body
    DB.run(`DELETE FROM users WHERE email = ?`, [email], function (err) {
        if (err) return res.status(500).json({ error: "Failed to delete user" })
        res.json({ deleted: this.changes })
    })
}

// Update password
export const updatePassword = (req, res) => {
    const { email, newPassword } = req.body
    const hashedPassword = bcrypt.hashSync(newPassword, 10)

    DB.run(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email], function (err) {
        if (err) return res.status(500).json({ error: "Failed to update password" })
        res.json({ updated: this.changes })
    })
}
// Sources:
// - Auth tokens (JWT): Auth0/jsonwebtoken. “API Reference — jwt.verify(), jwt.sign().” Accessed 23 Oct. 2025.
// - AI assistance: Portions drafted with OpenAI ChatGPT (GPT-5 Thinking), verified and adapted by the author for correctness.
// Accessed 23 Oct. 2025.
export const getCurrentUser = (req, res) => {
    try {
        const auth = req.headers.authorization || ""
        const [, token] = auth.split(" ")
        if (!token) return res.status(401).json({ error: "Missing token" })
        const payload = jwt.verify(token, JWT_SECRET)
        // Optionally, fetch user to ensure still exists
        DB.get(`SELECT id, email, username FROM users WHERE id = ?`, [payload.id], (err, row) => {
            if (err || !row) return res.status(401).json({ error: "Invalid token" })
            return res.json({ id: row.id, email: row.email, username: row.username })
        })
    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

// Sources:
// - Auth tokens (JWT): Auth0/jsonwebtoken. “API Reference — jwt.verify(), jwt.sign().” Accessed 23 Oct. 2025.
// - AI assistance: Portions drafted with OpenAI ChatGPT (GPT-5 Thinking), verified and adapted by the author for correctness.
// Accessed 23 Oct. 2025.
export const updateUsername = (req, res) => {
    try {
        const auth = req.headers.authorization || ""
        const [, token] = auth.split(" ")
        if (!token) return res.status(401).json({ error: "Missing token" })
        const payload = jwt.verify(token, JWT_SECRET)

        const { username } = req.body
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ error: "Username is required" })
        }

        DB.run(`UPDATE users SET username = ? WHERE id = ?`, [username, payload.id], function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to update username" })
            }
            if (this.changes === 0) {
                // No row updated — could be same username. Verify current user and respond success if unchanged.
                DB.get(`SELECT email, username FROM users WHERE id = ?`, [payload.id], (getErr, row) => {
                    if (getErr || !row) {
                        return res.status(500).json({ error: "Failed to verify username update" })
                    }
                    if (row.username === username) {
                        const newToken = jwt.sign({ id: payload.id, email: row.email, username }, JWT_SECRET, { expiresIn: "1h" })
                        return res.json({ success: true, token: newToken, user: { id: payload.id, email: row.email, username } })
                    }
                    return res.status(500).json({ error: "No changes applied" })
                })
                return
            }
            // Return a refreshed token including username
            const newToken = jwt.sign({ id: payload.id, email: payload.email, username }, JWT_SECRET, { expiresIn: "1h" })
            return res.json({ success: true, token: newToken, user: { id: payload.id, email: payload.email, username } })
        })
    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

// Sources:
// - AI assistance: Portions drafted with OpenAI ChatGPT (GPT-5 Thinking), verified and adapted by the author for correctness.
// Accessed 26 Nov. 2025.
export async function getUserScore(req, res) {
  try {
    const { username } = req.params;
    if (!username || username.trim().length < 2) {
      return res.status(400).json({ error: 'Username required' });
    }

    const user = await DB.get(
      'SELECT id, username FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
      [username.trim()]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Pick the best score recorded for this user
    const best = await DB.get(
      'SELECT MAX(score) AS score FROM leaderboard WHERE userId = ?',
      [user.id]
    );

    const score = best?.score ?? 0;
    return res.json({ username: user.username, score });
  } catch (err) {
    console.error('getUserScore:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
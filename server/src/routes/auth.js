import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs' // only if you later hash ADMIN_PASSWORD; not required right now
import { OAuth2Client } from 'google-auth-library'

const router = express.Router()

// ----- Google OAuth client (used when an id_token is provided) -----
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Helper: issue our app JWT
function issueAppToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

/**
 * POST /api/auth/login
 * Very simple username/password auth using env vars.
 * Replace with DB check if you need real users later.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = issueAppToken({ email, role: 'admin' })
    res.json({ token, user: { email, role: 'admin' } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
})

/**
 * POST /api/auth/google
 * Accepts either:
 *  - { id_token }  -> verify via Google (JWT)
 *  - { access_token } -> call Google UserInfo API to fetch the email
 */
router.post('/google', async (req, res) => {
  try {
    const { id_token, access_token } = req.body

    if (!id_token && !access_token) {
      return res.status(400).json({ message: 'No Google token provided' })
    }

    let email, name, picture

    if (id_token) {
      // Verify an ID token (JWT)
      const ticket = await googleClient.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      const payload = ticket.getPayload()
      email = payload?.email
      name = payload?.name
      picture = payload?.picture
    } else {
      // Resolve email via UserInfo API using access_token
      // Node 20+ has global fetch
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        throw new Error(`Invalid Google access token (${resp.status}): ${text}`)
      }
      const profile = await resp.json()
      email = profile?.email
      name = profile?.name
      picture = profile?.picture
    }

    if (!email) {
      return res.status(401).json({ message: 'Failed to resolve Google account email' })
    }

    // Restrict to Avero admins
    if (!email.toLowerCase().endsWith('@averoadvisors.com')) {
      return res.status(403).json({ message: 'This login is restricted to Avero Advisors accounts only.' })
    }

    const token = issueAppToken({ email, role: 'admin' })
    res.json({ token, user: { email, name, picture, role: 'admin' } })
  } catch (err) {
    console.error('Google login failed:', err)
    res.status(500).json({ message: 'Failed to login with Google' })
  }
})

export default router

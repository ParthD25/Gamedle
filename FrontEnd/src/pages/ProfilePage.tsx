import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateUsername } from '../../utils/apiFunctions'

export default function ProfilePage() {
  const { userInfo, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState(userInfo?.username ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    try {
      setSaving(true)
      const token = localStorage.getItem('token') || ''
      const result = await updateUsername(token, username.trim())
      // Update context with new username using existing token or refreshed token
      const newToken = result.token || token
      localStorage.setItem('token', newToken)
      login(newToken, { email: result.user.email, username: result.user.username })
      navigate('/')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {setError('ERROR:Failed to update username')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, width: '100%' }}>
      <h2>Profile</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
            required
          />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  )
}

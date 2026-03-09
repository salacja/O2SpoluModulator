import { useState, useEffect } from 'react'

const STORAGE_KEY = 'o2-preview-access'
const DEMO_PASSWORD = 'OOO2Spolu'

const styles = {
  gate: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
  },
  card: {
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    padding: 32,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 8px',
    color: '#1a1a1a',
  },
  desc: {
    fontSize: 14,
    color: '#666',
    margin: '0 0 24px',
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 8,
    marginBottom: 16,
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    background: '#0066cc',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  error: {
    fontSize: 14,
    color: '#c00',
    marginTop: 12,
  },
  bar: {
    height: 36,
    background: '#0066cc',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    fontSize: 13,
    flexShrink: 0,
  },
  logoutBtn: {
    padding: '6px 12px',
    fontSize: 13,
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 6,
    color: 'white',
    cursor: 'pointer',
  },
  appWrapper: {
    flex: 1,
  },
}

export default function PasswordGate({ children }) {
  const [granted, setGranted] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setGranted(stored === 'granted')
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password === DEMO_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'granted')
      setGranted(true)
    } else {
      setError('Nesprávné heslo.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setGranted(false)
    setPassword('')
    setError('')
  }

  if (!granted) {
    return (
      <div style={styles.gate}>
        <div style={styles.card}>
          <h1 style={styles.title}>O2 Spolu Preview</h1>
          <p style={styles.desc}>
            Toto je chráněný náhled prototypu. Pro zobrazení zadejte heslo.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.btn}>
              Vstoupit
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={styles.bar}>
        <span>Preview mode</span>
        <button type="button" style={styles.logoutBtn} onClick={handleLogout}>
          Odhlásit
        </button>
      </div>
      <div style={styles.appWrapper}>{children}</div>
    </div>
  )
}

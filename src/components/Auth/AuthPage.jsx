// src/components/Auth/AuthPage.jsx
import { useState } from 'react'
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from '../../firebase'


export default function AuthPage() {
  const [mode, setMode]       = useState('login')   // 'login' | 'signup'
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(user, { displayName: name || email.split('@')[0] })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Background decorations */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      <div style={styles.card} className="card fade-up">
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.quote}>“Grow at your own pace”</p>
          <h1 style={styles.title}>Bloom Planner</h1>
          <p style={styles.tagline}>focus on progress, not perfection</p>
        </div>

        {/* Toggle */}
        <div style={styles.toggle}>
          <button
            style={{ ...styles.toggleBtn, ...(mode === 'login' ? styles.toggleActive : {}) }}
            onClick={() => { setMode('login'); setError('') }}
          >Sign In</button>
          <button
            style={{ ...styles.toggleBtn, ...(mode === 'signup' ? styles.toggleActive : {}) }}
            onClick={() => { setMode('signup'); setError('') }}
          >Create Account</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.field}>
              <label style={styles.label}>Your Name </label>
              <input
                className="input-field"
                type="text"
                placeholder="e.g. Sophie"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="at least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: 8, padding: '13px', fontSize: 15 }}
          >
            {loading ? '...' : mode === 'login' ? ' Sign In' : ' Create My Planner'}
          </button>
        </form>

        <p style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.link} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  )
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email':        'Please enter a valid email.',
    'auth/wrong-password':       'Incorrect password. Try again!',
    'auth/user-not-found':       "We couldn't find that account.",
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/too-many-requests':    'Too many attempts. Please wait a moment.',
    'auth/invalid-credential':   'Wrong email or password.',
  }
  return map[code] ?? 'Something went wrong. Please try again.'
}

const styles = {
  page: {
    minHeight: '100dvh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
    background: 'var(--cream)',
    position: 'relative', overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: '50%',
    background: 'var(--blush-light)', opacity: 0.7,
  },
  bgCircle2: {
    position: 'absolute', bottom: -60, left: -60,
    width: 220, height: 220, borderRadius: '50%',
    background: 'var(--cream-deep)', opacity: 0.9,
  },
  card: {
    width: '100%', maxWidth: 420,
    padding: '36px 32px',
    position: 'relative', zIndex: 1,
  },
  header: { textAlign: 'center', marginBottom: 28 },
  quote: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 14,
    color: 'var(--brown-soft)',
    marginBottom: 10,
    letterSpacing: '0.02em',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 36, fontWeight: 700,
    color: 'var(--terracotta)',
    marginBottom: 4,
  },
  tagline: {
    fontFamily: 'var(--font-body)',
    fontSize: 13, color: 'var(--brown-soft)',
  },
  toggle: {
    display: 'flex',
    background: 'var(--cream-deep)',
    borderRadius: 'var(--radius-pill)',
    padding: 4, marginBottom: 24,
  },
  toggleBtn: {
    flex: 1, padding: '9px 16px',
    border: 'none', borderRadius: 'var(--radius-pill)',
    background: 'transparent',
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 400,
    color: 'var(--brown-soft)', cursor: 'pointer', transition: 'all 0.2s',
  },
  toggleActive: {
    background: 'var(--white)',
    color: 'var(--brown-dark)', fontWeight: 500,
    boxShadow: '0 1px 6px var(--shadow)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12, fontWeight: 500, color: 'var(--brown-mid)', letterSpacing: '0.04em' },
  error: {
    background: '#FDE8E8', color: '#C25454',
    border: '1px solid #F5C0C0',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px', fontSize: 13,
  },
  switchText: { textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--brown-soft)' },
  link: { color: 'var(--terracotta)', cursor: 'pointer', fontWeight: 500 },
}

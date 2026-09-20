import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const FEATURES = [
  { icon: '📅', text: 'Visual monthly calendar' },
  { icon: '✅', text: 'Track tasks & habits' },
  { icon: '⭐', text: 'Earn badges for consistency' },
  { icon: '🌙', text: 'Dark mode support' },
]

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Min. 6 characters'}
        className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 pr-10 text-sm text-plum placeholder:text-muted/60 focus:border-primary/50 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-plum"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

export default function AuthPage() {
  const { login, signup, resetPassword } = useAuth()

  // mode: 'login' | 'signup' | 'forgot_email' | 'forgot_reset' | 'forgot_done'
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  function goTo(m) {
    setMode(m)
    setError('')
    setForm({ name: '', email: '', password: '', newPassword: '', confirmPassword: '' })
  }

  // ── Login / Signup submit ──────────────────────────────────────────────────
  async function handleAuthSubmit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'signup' && !form.name.trim()) return setError('Please enter your name.')
    if (!form.email.trim()) return setError('Please enter your email.')
    if (!form.password || form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 350))
    const result = mode === 'login' ? login(form) : signup(form)
    setLoading(false)
    if (result.error) setError(result.error)
  }

  // ── Forgot: step 1 — verify email ─────────────────────────────────────────
  async function handleForgotEmail(e) {
    e.preventDefault()
    setError('')
    if (!form.email.trim()) return setError('Please enter your email.')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 350))
    // Check if account exists
    const { loadUsers } = await import('../utils/storage.js')
    const users = loadUsers()
    const exists = users.find((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())
    setLoading(false)
    if (!exists) return setError('No account found with that email.')
    setMode('forgot_reset')
  }

  // ── Forgot: step 2 — set new password ────────────────────────────────────
  async function handleForgotReset(e) {
    e.preventDefault()
    setError('')
    if (!form.newPassword || form.newPassword.length < 6) return setError('Password must be at least 6 characters.')
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match.')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 350))
    const result = resetPassword({ email: form.email, newPassword: form.newPassword })
    setLoading(false)
    if (result.error) return setError(result.error)
    setMode('forgot_done')
  }

  const cardContent = {
    login: {
      title: 'Welcome back ♡',
      sub: 'Log in to continue planning your best month.',
    },
    signup: {
      title: 'Create account ♡',
      sub: 'Join MonthMate and start slaying your goals.',
    },
    forgot_email: {
      title: 'Forgot password?',
      sub: "No worries! Enter your email and we'll let you reset it.",
    },
    forgot_reset: {
      title: 'Set new password ♡',
      sub: `Resetting password for ${form.email}`,
    },
    forgot_done: {
      title: 'All done! ♡',
      sub: 'Your password has been reset. Log in with your new password.',
    },
  }

  return (
    <div className="flex min-h-screen bg-bg font-body text-plum">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary-soft via-lavender to-bg px-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-lavender/60" />
        <div className="pointer-events-none absolute top-1/3 right-8 h-6 w-6 rounded-full bg-primary/20" />
        <div className="relative text-center">
          <h1 className="font-display text-5xl leading-tight text-plum tracking-tight">
            MonthMate <span className="text-primary">♥</span>
          </h1>
          <p className="mt-3 text-lg text-muted">Plan it. Do it. Slay it.</p>
          <div className="mt-10 space-y-4 text-left">
            {FEATURES.map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-xl2 bg-card/70 px-4 py-3 shadow-soft">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-plum">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="font-display text-3xl text-plum">
              MonthMate <span className="text-primary">♥</span>
            </h1>
            <p className="mt-1 text-sm text-muted">Plan it. Do it. Slay it.</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl3 bg-card p-7 shadow-lift">

                {/* Back arrow for forgot screens */}
                {(mode === 'forgot_email' || mode === 'forgot_reset') && (
                  <button
                    onClick={() => goTo(mode === 'forgot_reset' ? 'forgot_email' : 'login')}
                    className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-plum"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}

                <h2 className="font-display text-2xl text-plum">{cardContent[mode]?.title}</h2>
                <p className="mt-1 text-sm text-muted">{cardContent[mode]?.sub}</p>

                {/* ── Login ──────────────────────────────── */}
                {mode === 'login' && (
                  <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted">Email</label>
                      <input
                        autoFocus
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/60 focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-xs font-semibold text-muted">Password</label>
                        <button
                          type="button"
                          onClick={() => goTo('forgot_email')}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <PasswordInput value={form.password} onChange={(e) => set('password', e.target.value)} />
                    </div>
                    {error && <p className="rounded-xl2 bg-primary-soft px-3 py-2 text-xs font-medium text-primary">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card hover:bg-primary-dark disabled:opacity-60 transition-colors">
                      {loading ? '...' : 'Log in'}
                    </button>
                  </form>
                )}

                {/* ── Sign up ────────────────────────────── */}
                {mode === 'signup' && (
                  <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted">Your name</label>
                      <input
                        autoFocus
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="Katyani"
                        className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/60 focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/60 focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted">Password</label>
                      <PasswordInput value={form.password} onChange={(e) => set('password', e.target.value)} />
                    </div>
                    {error && <p className="rounded-xl2 bg-primary-soft px-3 py-2 text-xs font-medium text-primary">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card hover:bg-primary-dark disabled:opacity-60 transition-colors">
                      {loading ? '...' : 'Create account'}
                    </button>
                  </form>
                )}

                {/* ── Forgot: step 1 — email ─────────────── */}
                {mode === 'forgot_email' && (
                  <form onSubmit={handleForgotEmail} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted">Your email</label>
                      <input
                        autoFocus
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl2 border border-plum/10 bg-bg px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/60 focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    {error && <p className="rounded-xl2 bg-primary-soft px-3 py-2 text-xs font-medium text-primary">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card hover:bg-primary-dark disabled:opacity-60 transition-colors">
                      {loading ? '...' : 'Continue'}
                    </button>
                  </form>
                )}

                {/* ── Forgot: step 2 — new password ─────── */}
                {mode === 'forgot_reset' && (
                  <form onSubmit={handleForgotReset} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted">New password</label>
                      <PasswordInput
                        value={form.newPassword}
                        onChange={(e) => set('newPassword', e.target.value)}
                        placeholder="Min. 6 characters"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted">Confirm password</label>
                      <PasswordInput
                        value={form.confirmPassword}
                        onChange={(e) => set('confirmPassword', e.target.value)}
                        placeholder="Repeat your new password"
                      />
                    </div>
                    {error && <p className="rounded-xl2 bg-primary-soft px-3 py-2 text-xs font-medium text-primary">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card hover:bg-primary-dark disabled:opacity-60 transition-colors">
                      {loading ? '...' : 'Reset password'}
                    </button>
                  </form>
                )}

                {/* ── Forgot: done ───────────────────────── */}
                {mode === 'forgot_done' && (
                  <div className="mt-6">
                    <div className="flex justify-center text-4xl mb-4">🎉</div>
                    <button
                      onClick={() => goTo('login')}
                      className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card hover:bg-primary-dark transition-colors"
                    >
                      Back to log in
                    </button>
                  </div>
                )}

                {/* ── Toggle login/signup ─────────────────── */}
                {(mode === 'login' || mode === 'signup') && (
                  <p className="mt-5 text-center text-sm text-muted">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      onClick={() => goTo(mode === 'login' ? 'signup' : 'login')}
                      className="font-semibold text-primary hover:underline"
                    >
                      {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                  </p>
                )}

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

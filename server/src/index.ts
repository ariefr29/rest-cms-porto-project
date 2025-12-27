import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import { projectRoutes } from './routes/projects'
import { siteRoutes } from './routes/sites'
import { publicApiRoutes } from './routes/public-api'
import { authRoutes } from './routes/auth'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
}))

const jwtSecret = process.env.JWT_SECRET || 'secret'

// Custom JWT middleware that properly handles cookie-based auth
const authMiddleware = async (c: any, next: any) => {
  const token = getCookie(c, 'auth_token')

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const payload = await verify(token, jwtSecret)
    c.set('jwtPayload', payload)
    await next()
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

// Auth routes - login and logout are public
app.post('/api/auth/login', async (c) => {
  const body = await c.req.json()

  // Trim values to avoid accidental whitespace issues from .env
  const adminUser = (process.env.ADMIN_USER || 'admin').trim()
  const adminPass = (process.env.ADMIN_PASS || 'admin123').trim()

  const receivedUser = (body.username || '').trim()
  const receivedPass = (body.password || '') // Don't trim received password as it might have intentional spaces

  if (receivedUser === adminUser && receivedPass === adminPass) {
    const { sign } = await import('hono/jwt')
    const { setCookie } = await import('hono/cookie')

    const payload = {
      username: body.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }
    const token = await sign(payload, jwtSecret)

    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return c.json({ success: true, message: 'Login successful' })
  }

  return c.json({ success: false, message: 'Invalid credentials' }, 401)
})

app.post('/api/auth/logout', async (c) => {
  const { deleteCookie } = await import('hono/cookie')
  deleteCookie(c, 'auth_token', { path: '/' })
  return c.json({ success: true, message: 'Logged out' })
})

// Protected verify endpoint
app.get('/api/auth/verify', authMiddleware, async (c) => {
  return c.json({ authenticated: true })
})

// Protect all management routes before mounting them
app.use('/api/projects', authMiddleware)
app.use('/api/projects/*', authMiddleware)
app.use('/api/sites', authMiddleware)
app.use('/api/sites/*', authMiddleware)

// Route handlers
app.route('/api/projects', projectRoutes)
app.route('/api/sites', siteRoutes)
app.route('/api/v1', publicApiRoutes)

app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT) || 3000
console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

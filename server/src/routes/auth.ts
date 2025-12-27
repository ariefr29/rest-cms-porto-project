import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { setCookie, deleteCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const authRoutes = new Hono()

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
})

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
    const { username, password } = c.req.valid('json')

    const adminUser = process.env.ADMIN_USER || 'admin'
    const adminPass = process.env.ADMIN_PASS || 'admin123'
    const jwtSecret = process.env.JWT_SECRET || 'secret'

    if (username === adminUser && password === adminPass) {
        const payload = {
            username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
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

authRoutes.get('/verify', async (c) => {
    return c.json({ authenticated: true })
})

authRoutes.post('/logout', (c) => {
    deleteCookie(c, 'auth_token', {
        path: '/',
    })
    return c.json({ success: true, message: 'Logged out' })
})

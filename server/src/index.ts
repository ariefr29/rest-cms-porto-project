import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { projectRoutes } from './routes/projects'
import { siteRoutes } from './routes/sites'
import { publicApiRoutes } from './routes/public-api'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

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

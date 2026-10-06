import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDatabase } from './src/db/models/user.model.js'
import authRoutes from './src/routes/auth.routes.js'
import { errorHandler } from './src/middlewares/error.middleware.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/v1/auth', authRoutes)
app.use(errorHandler)

const startServer = async () => {
  try {
    await initDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Server error:', error.message)
  }
}

startServer()

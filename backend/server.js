import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from './config/mongodb.js'
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import path from 'path'


// app config
const app = express()
const port = process.env.PORT || 4000
const __dirname = path.resolve()

connectDB()
connectCloudinary()

// middlewares
app.use(cors())
app.use(express.json())

// api endpoints ZUERST registrieren
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// static files + catch-all NACH den API-Routen
app.use(express.static(path.join(__dirname, '/frontend/dist')))
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})

app.listen(port, '0.0.0.0', () => console.log(`Server Started: ${port}`))

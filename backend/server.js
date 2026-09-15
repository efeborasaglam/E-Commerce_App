import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from './config/mongodb.js'
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import path from 'path'

const app = express()
const port = process.env.PORT || 4000
const __dirname = path.resolve()

connectDB()
connectCloudinary()

app.use(cors())
app.use(express.json())

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.use(express.static(path.join(__dirname, 'frontend', 'dist')))

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})

app.listen(port, () => console.log(`Server Started: ${port}`))

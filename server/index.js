import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import mongoose from 'mongoose'
import userRouter from './routers/userRouter.js'
import listingRouter from './routers/listingRouter.js'
import allshopRouter from './routers/allshopRouter.js'
import mainRouter from './routers/mainRouter.js'
import path from 'path';

const __dirname = path.resolve();



dotenv.config();


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/listing', listingRouter)
app.use('/api/allshop', allshopRouter)
app.use('/api/main', mainRouter)

// after this API write otherwise code not work, for home page
app.use(express.static(path.join(__dirname, 'client/dist')));

// any address or path access using "*" method
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", 'dist', 'index.html'))
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB_DATABASE)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.log(error.message))


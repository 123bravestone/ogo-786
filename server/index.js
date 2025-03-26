import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import mongoose from 'mongoose'
import userRouter from './routers/userRouter.js'
import listingRouter from './routers/listingRouter.js'
import allshopRouter from './routers/allshopRouter.js'
import mainRouter from './routers/mainRouter.js'




dotenv.config();


const app = express()

// app.use(cors())


app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/listing', listingRouter)
app.use('/api/allshop', allshopRouter)
app.use('/api/main', mainRouter)

const corsOptions = {
    origin: "https://offlinego.in", // Allow only your frontend domain
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
};
app.use(cors(corsOptions));

// If using Cloudinary, ensure the API call has CORS headers

app.get('/', (req, res) => {
    res.json({ message: "API is running..." });
});
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB_DATABASE)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.log(error.message))


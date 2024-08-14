import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import authRoute from './routes/auth.route.js'
import bodyParser from 'body-parser';

// Variables
const server = express();
const PORT = 3000;

dotenv.config();

// Middlewares
server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(bodyParser.urlencoded({ extended: true })); // Optional: If you're using URL encoded bodies

// Routes
server.use('/api/auth', authRoute)




server.listen(PORT, () => {
    connectDB()
    console.log('server listen on port :', PORT);
})
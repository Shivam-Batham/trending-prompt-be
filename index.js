import express from 'express';
import connectDB from './db/db_connection.js';
import dotenv from 'dotenv';
import UserRouter from './routes/user_routes.js';
import PostRouter from './routes/post_routes.js';
import cors from "cors";
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
}));

app.use(express.json({limit:'1000kb'}));
app.use(cookieParser());

/* User Routes */ 
app.use('/api/user',UserRouter);

/* Post Routes */
app.use('/api/post',PostRouter);

app.get('/', (req, res) => {
  return res.status(200).json({
    server_health:true
  })
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
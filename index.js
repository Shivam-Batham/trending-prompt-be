import express from 'express';
import connectDB from './db/db_connection.js';
import dotenv from 'dotenv';
import UserRouter from './routes/user_routes.js';
import PostRouter from './routes/post_routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json({limit:'1000kb'}))

/* User Routes */ 
app.use('/api/user',UserRouter);

/* Post Routes */
app.use('/api/post',PostRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import productsRoutes from './routes/products.js'; // Import the client routes

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());

// Initialize database connection and pass it to routes using middleware
const initDbConnection = async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  app.use((req, res, next) => {
    req.db = db;
    next();
  });
};

initDbConnection().then(() => {
  app.use('/api/products', productsRoutes); // Use the client routes

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
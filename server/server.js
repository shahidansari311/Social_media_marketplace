import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express'
import { clerkMiddleware } from '@clerk/express'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(clerkMiddleware())
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Home Page!');
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
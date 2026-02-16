import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware,getAuth } from '@clerk/express'
import { prisma } from './configs/prisma.js';   
import {serve} from 'inngest/express'
import { Inngest,functions, inngest} from './inngest/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(clerkMiddleware())
app.use(express.json());
app.use(cors());

app.get('/my-profile', async (req, res) => {
    const { userId } = getAuth(req); // Get the authenticated user ID from Clerk
    
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});
app.use('/api/inngest',serve({client : inngest ,functions}))

app.get('/', (req, res) => {
    res.send('Home Page!');
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
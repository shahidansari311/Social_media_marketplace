import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { prisma } from './configs/prisma.js';   
import { serve } from 'inngest/express';
import { functions, inngest } from './inngest/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware order matters!
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const autoSyncUser = async (req, res, next) => {
    const { userId, sessionClaims } = getAuth(req);

    if (!userId) {
        return next();
    }

    try {
        const email = sessionClaims?.email || '';
        const firstName = sessionClaims?.first_name || '';
        const lastName = sessionClaims?.last_name || '';
        const image = sessionClaims?.image_url || '';

        await prisma.user.upsert({
            where: { id: userId },
            update: {
                email,
                name: `${firstName} ${lastName}`.trim() || 'User',
                image,
            },
            create: {
                id: userId,
                email,
                name: `${firstName} ${lastName}`.trim() || 'User',
                image,
            },
        });
    } catch (error) {
        console.error('Auto-sync error:', error);
    }

    next();
};

app.use(autoSyncUser);

app.get('/', (req, res) => {
    res.send('Server is live!');
});

app.get('/my-profile', async (req, res) => {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.use('/api/inngest', serve({ client: inngest, functions ,signingKey: process.env.INNGEST_SIGNING_KEY, }));

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
import express from 'express';
const router = express.Router();
import { CrashPoint } from '../models/crashPoints.js';

router.get('/crash-history', async (req, res) => {
    try {
        const crashPoints = await CrashPoint.find()
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ success: true, crashPoints: crashPoints.reverse() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch crash points' });
    }
});

export default router;
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
const router = express.Router();

router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Incorrect Password" });

        const newLogin = new Date();
        const lastLogin = user.loginAt;

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                phone: user.phone,
                amount: user.amount,
                expPoint: user.expPoint,
                loginAt: Date.now(),
                lastReward: user.lastReward,
            }
        });
    } catch (error) {
        console.error("login err", error);
        res.status(500).json({ message: "Server error" })
    }
});

router.post('/signup', async (req, res) => {
    const { username, phone, password } = req.body;

    if (!username || !phone || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const user = await User.findOne({ phone });
        if (user) return res.status(409).json({ message: "User already exists" });

        // const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            phone,
            password: hashedPassword,
            amount: 100,
            expPoint: 0,
        })

        await newUser.save();
        res.status(201).json({ message: "Signup successful" })
        console.log("done")
    } catch (error) {
        console.error("signup error", error)
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/rewards', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (user) console.log(user); 

        const today = new Date().toDateString();
        const lastReward = user.lastReward?.toDateString();

        if (today == lastReward) {
            return res.status(400).json({ message: "Already claimed today" });
        }

        user.lastReward = new Date();
        await user.save();
        res.status(200).json({ message: "Daily reward claimed" })
    } catch (error) {
        console.error("reward error", error);
    }
})


export default router;
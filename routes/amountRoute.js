import express from "express";
const router = express.Router();
import jwt from 'jsonwebtoken';
import { User } from "../models/user.js";

router.put("/amount", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userId = decoded.id;
        const {amount} = req.body;

        const user = await User.findByIdAndUpdate(userId, { amount });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Amount updating error", error);
        res.status(500).json({ message: "server error" });
    }
})

router.put("/exp", async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userId = decoded.id;
        const { exp , type } = req.body;
        const expChange = type == "INC" ? exp : -exp;
        
        const user = await User.findByIdAndUpdate(userId, { $inc: {expPoint: expChange }});
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("expPoint updating error", error);
        res.status(500).json({ message: "server error" });
    }
})

export default router;
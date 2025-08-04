import express from 'express';
import { User } from '../models/user.js';
import jwt  from 'jsonwebtoken';
import { BetHistory } from '../models/betHistory.js';
const router = express.Router();

router.post('/betHistory', async(req,res)=>{
    const authToken = req.headers.authorization;
    const {bet,crash,cashout} = req.body;
    console.log(req.body);
    
    if(!authToken || !authToken.startsWith('Bearer')){
        return res.status(401).json({message:"Token not provided"})
    }
    if ([bet, crash, cashout].some(v => v === undefined || v === null)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const token = authToken.split(' ')[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        console.log(decoded);
        req.userId = decoded.id;

        const newBet = new BetHistory({userId:req.userId,bet,crash,cashout});
        await newBet.save();

        res.status(201).json({message:'Bet saved successfully'})
    }catch(error){
        console.error("bet saving error", error);
        res.status(500).json({message:"Error saving bet", error:error.message})
    }

})


router.get('/myBets', async(req,res)=>{
    const authToken = req.headers.authorization;
    
    if(!authToken || !authToken.startsWith('Bearer')){
        return res.status(401).json({message:"Token not provided"})
    }
    const token = authToken.split(' ')[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        console.log(decoded);
        req.userId = decoded.id;

        const history = await BetHistory.find({ userId:req.userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: history
        });
    }catch(error){
        console.error("bet saving error", error);
        res.status(500).json({message:"Error saving bet", error:error.message})
    }

})

export default router;
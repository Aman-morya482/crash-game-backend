// import express from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// const router = express.Router();
// import {User} from "../models/user"

// const sample = {
//     username: "user",
//     phone:"9999999999",
//     password:"password",
// };

// router.post('/login', async(req,res)=>{
//     const {phone,password} = req.body;

//     try{
//         const user = await User.findOne({phone});
//         if(!user) return res.status(404).json({message:"User not found"});

//         const match = bcrypt.compare(password,user.password);
//         if(!match) return res.status(401).json({message:"Incorrect Password"});

//         const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn: '2h'});

//         res.status(200).json({
//             message:'Login successful',
//             token,
//             user:{
//                 username:user.username,
//                 phone:user.phone,
//                 amount:user.amount,
//                 expPoint:user.expPoint,
//             }
//         });
//     }catch(error){
//         console.error("login err",error);
//         res.status(500).json({message:"Server error"})
//     }
// });

// export default router;
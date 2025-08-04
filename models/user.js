import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phone: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    amount: { type: Number, default: 100, },
    expPoint: { type: Number, default: 0, },
    lastReward:{type:Date, default:null},
}, { timestamps: true, });

// userSchema.pre('save',async(next)=>{
//     if(!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = bcrypt.hash(this.password,salt);
//     next();
// })

// userSchema.methods.comparePassword = (enteredPass)=>{
//     return bcrypt.compare(enteredPass, this.password);
// }

export const User = mongoose.model('User', userSchema);
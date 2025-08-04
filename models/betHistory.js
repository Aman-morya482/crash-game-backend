import mongoose from 'mongoose'

const betSchema = mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    bet:{type:Number,required:true},
    crash:{type:Number,required:true},
    cashout:{type:Number,required:true,default:0},
    createdAt:{type:Date,default:Date.now}
})

export const BetHistory = mongoose.model('BetHistory',betSchema);
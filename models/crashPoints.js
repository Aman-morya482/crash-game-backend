import mongoose from 'mongoose';

const gameSchema = mongoose.Schema({
    value: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export const CrashPoint = mongoose.model('CrashPoint', gameSchema)
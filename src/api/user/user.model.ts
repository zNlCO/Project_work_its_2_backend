import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./user.entity";

const userSchema = new mongoose.Schema<User>({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    isOperator: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
})

userSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

userSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export const UserModel = mongoose.model<User>('User', userSchema);
import mongoose, { Schema, Types } from "mongoose";
import { UserEntity } from "./user.entity";

export const UserSchema: Schema = new Schema({
  lastName: String,
  firstName: String,
  openingDate:{
    type: Date,
    default: () => new Date()
  },
  IBAN: String,
});

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const UserModel = mongoose.model<UserEntity>(
  "User",
  UserSchema,
  "Users"
);

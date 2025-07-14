import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
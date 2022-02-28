import { Schema, model } from "mongoose";

export interface User {
  username: string;
  password: string;
}

const userSchema = new Schema<User>({
  username: String,
  password: String,
});

export const UserModel = model<User>("User", userSchema);

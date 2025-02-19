import type mongoose from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: mongoose.Types.ObjectId | null;
  comparePassword: (value: string) => Promise<boolean>;
  omitPassword: () => Omit<UserDocument, "password">;
}

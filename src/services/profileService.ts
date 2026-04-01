import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { IUser } from "@/types/user";

export const profileService = {
  getUserByEmail: async (email: string): Promise<IUser | null> => {
    await connectToDatabase();
    return User.findOne({ email }).lean() as Promise<IUser | null>;
  },

  updateProfile: async (email: string, data: Partial<IUser>): Promise<IUser | null> => {
    await connectToDatabase();
    return User.findOneAndUpdate(
      { email },
      { $set: data },
      { new: true }
    ).lean() as Promise<IUser | null>;
  },
};

import type { AuthRequest } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller:", error);
    next(error);
  }
}

export const authCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let user = await User.findOne({ clerkId });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await User.create({
        clerkId,
        name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in authCallback controller:", error);
    next(error);
  }
}
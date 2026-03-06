import type { AuthRequest } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const users = await User.find({ _id: { $ne: userId } }).select("-__v");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers controller:", error);
    res.status(500)
    next(error);
  }
}
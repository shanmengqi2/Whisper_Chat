import type { AuthRequest } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const chatId = req.params.chatId;
    const chat = await Chat.findOne({ _id: chatId, participants: userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error);
    res.status(500)
    next(error);
  }
}
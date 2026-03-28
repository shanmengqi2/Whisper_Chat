import type { AuthRequest } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";
import Chat from "../models/Chat";
import { Types } from "mongoose";

export const getChats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 })
      .lean(); // Add lean for plain JS objects
    const formatedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);
      return {
        ...chat,
        participant: otherParticipant ?? null,
      }
    })
    res.status(200).json(formatedChats);
  } catch (error) {
    console.log("Error in getChats controller:", error);
    res.status(500)
    next(error);
  }
}

export const getOrCreateChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const participantId = req.params.participantId;
    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }
    if (!Types.ObjectId.isValid(participantId as string)) {
      return res.status(400).json({ message: "Invalid participant ID" });
    }
    if (userId === participantId) {
      return res.status(400).json({ message: "Participant ID cannot be same as user ID" });
    }
    let chat = await Chat.findOne({ participants: { $all: [userId, participantId] } })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .lean();
    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      const populatedChat = await newChat.populate("participants", "name email avatar");
      chat = populatedChat.toObject();
    }

    const otherParticipant = (chat.participants as any).find((p: any) => p._id.toString() !== userId);
    const formatedChat = {
      ...chat,
      participant: otherParticipant ?? null,
    }
    res.status(200).json(formatedChat);
  } catch (error) {
    console.log("Error in getOrCreateChat controller:", error);
    res.status(500)
    next(error);
  }
}
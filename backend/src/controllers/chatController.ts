import type { AuthRequest } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";
import Chat from "../models/Chat";

export const getChats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });
    const formatedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);
      return {
        ...chat,
        participants: otherParticipant,
        _id: chat._id
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
    let chat = await Chat.findOne({ participants: { $all: [userId, participantId] } })
      .populate("participants", "name email avatar")
      .populate("lastMessage");
    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
      return res.status(201).json(chat);
    }

    const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);
    const formatedChat = {
      ...chat,
      participants: otherParticipant ?? null,
      _id: chat._id
    }
    res.status(200).json(formatedChat);
  } catch (error) {
    console.log("Error in getOrCreateChat controller:", error);
    res.status(500)
    next(error);
  }
}
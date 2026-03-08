import { Socket, Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http"
import { verifyToken } from "@clerk/express"
import Message from "../models/Message"
import Chat from "../models/Chat"
import User from "../models/User"


interface SocketWithUserId extends Socket {
  userId: string
}

export const onlineUsers = new Map<string, string>()


export const initializeSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [
    "http://localhost:8081", // Expo mobile
    "http://localhost:5173", // Vite web dev
    process.env.FRONTEND_URL! as string, // production
  ]

  const io = new SocketServer(httpServer, { cors: { origin: allowedOrigins } })

  // verify socket connection

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token // this is what user will send from client
    if (!token) {
      return next(new Error("Authentication error"))
    }
    try {
      const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! as string })
      const clerkId = session.sub
      const user = await User.findOne({ clerkId })
      if (!user) {
        return next(new Error("User not found"))
      }
      (socket as SocketWithUserId).userId = user._id.toString()

      next()
    } catch (error) {
      next(new Error(error as string))
    }
  })

  io.on("connection", (socket) => {
    const userId = (socket as SocketWithUserId).userId

    // send list of active users to the connected user
    socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

    // store the user in the map
    onlineUsers.set(userId, socket.id);

    // notify other users that this user is now online
    socket.broadcast.emit("user-online", { userId });

    socket.join(`user:${userId}`)

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`)
    })

    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`)
    })

    // handle sending messages
    socket.on("send-message", async (data: { chatId: string, text: string }) => {
      try {
        const { chatId, text } = data
        // check if the chat exists
        const chat = await Chat.findOne({ _id: chatId, participants: userId })
        if (!chat) {
          return socket.emit("socket-error", "Chat not found")
        }

        // create the message
        const message = await Message.create({
          chat: chatId,
          sender: userId,
          text,
        })
        chat.lastMessage = message._id
        chat.lastMessageAt = message.createdAt
        await chat.save()
        await message.populate("sender", "name email avatar")

        io.to(`chat:${chatId}`).emit("new-message", message)

        // also emit the message to the participants
        for (const participantId of chat.participants) {
          io.to(`user:${participantId}`).emit("new-message", message)
        }
      } catch (error) {
        socket.emit("socket-error", { message: "Failed to send message" })
      }
    })

    // TODO: LATER
    socket.on("typing", (data: { chatId: string }) => {
      const { chatId } = data
      socket.to(`chat:${chatId}`).emit("typing", { userId })
    })

    socket.on("disconnect", () => {
      onlineUsers.delete(userId)
      socket.broadcast.emit("user-offline", { userId })
    })

    // console.log(`a user connected with id: ${userId}`)
  })

  return io;
}
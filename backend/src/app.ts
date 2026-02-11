import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import chatRoutes from "./routes/chatRoutes";


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  res.json({ status: "OK", message: "Server is running", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

// curl get command: curl http://localhost:3005/health

export default app;

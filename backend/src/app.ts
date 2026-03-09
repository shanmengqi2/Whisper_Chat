import express from "express";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import chatRoutes from "./routes/chatRoutes";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler";


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use(clerkMiddleware())

app.get("/health", async (req, res) => {
  res.json({ status: "OK", message: "Server is running", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

// curl get command: curl http://localhost:3005/health
app.use(errorHandler)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../web/dist")))

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../web/dist/index.html"))
  })
}
export default app;

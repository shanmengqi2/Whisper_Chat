import app from "./src/app";
import { connectDB } from "./src/config/database";
import { createServer } from "http";
import { initializeSocket } from "./src/utilts/socket";

const PORT = process.env.PORT || 3005;

const httpServer = createServer(app);

initializeSocket(httpServer);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running dev on port ${PORT}`);
  });
}).catch((error) => {
  console.error("❌ MongoDB connection error:", error);
  process.exit(1);
});
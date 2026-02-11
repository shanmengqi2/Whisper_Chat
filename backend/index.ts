import app from "./src/app";
import { connectDB } from "./src/config/database";

const PORT = process.env.PORT || 3005;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running dev on port ${PORT}`);
  });
}).catch((error) => {
  console.error("❌ MongoDB connection error:", error);
  process.exit(1);
});
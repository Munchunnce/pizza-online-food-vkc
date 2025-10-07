import express from "express";
import { APP_PORT, MONGO_CONNECTION_URL } from "./config/index.js";
import errorhandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";
import adminRoutes from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS enable
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Database Connection
mongoose
  .connect(MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

global.appRoot = path.resolve(__dirname);

// ✅ Parse JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api", routes);
app.use("/app", adminRoutes);

// ✅ Error handler
app.use(errorhandler);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully on Vercel!");
});

// ✅ Server listen (local only — Vercel auto handles it)
if (process.env.NODE_ENV !== "production") {
  app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}.`));
}

export default app;

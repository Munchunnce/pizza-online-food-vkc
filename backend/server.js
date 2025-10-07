import express from "express";
import { APP_PORT, MONGO_CONNECTION_URL } from "./config/index.js";
import errorhandler from "./middlewares/errorHandler.js";
const app = express();
import routes from "./routes/index.js";
import adminRoutes from "./routes/index.js";
import mongoose from "mongoose";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url"; // ⬅️ Add this

// Fix for __dirname in ES Modules
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

// database connection

mongoose.connect(MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Connected to MongoDB");
  })
  .on("error", (error) => {
    console.log("Error connecting to MongoDB:", error);
  });

global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", routes);
app.use("/app", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(errorhandler);

app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully on Vercel!");
});

app.listen(APP_PORT, () => console.log(`Lisenting on port ${APP_PORT}.`));

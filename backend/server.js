import express from "express";
import { APP_PORT, MONGO_CONNECTION_URL } from "./config/index.js";
import errorhandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";
import adminRoutes from "./routes/index.js";
import mongoose from "mongoose";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url"; // ⬅️ Add this
import { createServer } from "http";
import { Server } from "socket.io";


// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//  Socket.io connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // join room per user
  socket.on("join_room", (orderId) => {
    socket.join(orderId);
    console.log(`User joined room: ${orderId}`);
  });

  // admin joins orders room
  socket.on("join_orders_room", () => {
    socket.join("orders_room");
    console.log("Admin joined orders_room");
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Make io accessible globally
global.io = io;
// ✅ CORS enable
app.use(cors());

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
app.use("/uploads", express.static("uploads"));
app.use(errorhandler);

app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully on Vercel!");
});

server.listen(APP_PORT, () => console.log(`Lisenting on port ${APP_PORT}.`));
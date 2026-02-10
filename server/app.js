import express from "express";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import adminRouter from "./routes/admin.route.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createUser } from "./seeders/user.seed.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./utils/helper.js";
import { Message } from "./models/message.model.js";
import cors from "cors";
import {v2 as cloudinary} from 'cloudinary'

const app = express();
const server = new createServer(app);
const io = new Server(server);

dotenv.config();
const port = 3000 || process.env.PORT;
export const adminSecretKey = process.env.ADMIN_SECRET_KEY || "skdjfksjfne";
export const userSocketIds = new Map();

connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/admin", adminRouter);

io.on("connection", (socket) => {
  const user = {
    _id: "skdf",
    name: "nambo",
  };
  userSocketIds.set(user._id.toString(), socket.id);
  console.log(userSocketIds);
  console.log(`A user is connected with ${socket.id}`);
  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(), // used to generate random id
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };
    const memberSocketIDs = getSockets(members); // here we have written this so that we can send messages to different users that are connected to socket with the help of their socketIDs
    io.to(memberSocketIDs).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(memberSocketIDs).emit(NEW_MESSAGE_ALERT, { chatId });
    try {
      await Message.create(messageForDB);
    } catch (e) {
      console.log(e);
    }
    console.log("New Message", messageForRealTime);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    userSocketIds.delete(user._id.toString());
  });
});
app.use(errorMiddleware);

server.listen(3000, () => {
  console.log(
    `Server is listening on port: ${port} in ${process.env.NODE_ENV} mode`,
  );
});

import express from "express";
import connectDBANDSERVER from "./utils/connectdb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";
import refreshRoute from "./routes/refresh.js";
import chatRoutes from './routes/chat.js'
import cors from "cors";
import bodyParser from "body-parser";
import corsOptions from "./config/corsOptions.js";
dotenv.config();
import {app, server} from './socket/socket.js'
// const app = express();
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT;
connectDBANDSERVER(CONNECTION_URL, PORT, server);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ extended: true, limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use((req, res, next) => {
  console.log(req.method + "ING ", req.url);
  next();
});
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/refresh", refreshRoute);
app.use("/chat", chatRoutes);

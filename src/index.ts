import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routers/auth"

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/", router);
app.listen(process.env.PORT, ()=> console.log(`Up and running at ${process.env.HOSTNAME}:${process.env.PORT}`))

import dotenv from "dotenv";
import express from "express";
import dbConnection from "./config/dbConnection.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import dns from "node:dns"; 
dotenv.config({ path: "./.env" });

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

dbConnection()
  .then(() => {
    console.log("Connected with database");
    app.listen(process.env.PORT, () => {
      console.log("Connected, PORT: ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Error in index.js" + err);
  });

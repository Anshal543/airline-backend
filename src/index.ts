import express from "express";
import { SERVER_CONFIG, Logger } from "./config/index.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`Server is running on port ${SERVER_CONFIG.PORT}`);
  Logger.log({
    level: "warn",
    message: `Server started on port ${SERVER_CONFIG.PORT}`,
  });
});

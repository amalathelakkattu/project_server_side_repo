import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/indexRoutes.js";


const app = express();
app.use(express.json())
app.use(
  cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      credentials: true,
  })
);
app.use(cookieParser())
const port = 3000;

connectDB();

// app.get('/', (req, res) => {
//   res.send('Hello World!')
//   console.log("fvsef")
// })


app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
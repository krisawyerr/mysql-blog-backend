import express from "express";
import postRoutes from "./routes/post.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(cookieParser());
app.use(express.json())

app.use("/api/post", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file
  res.status(200).json(file.filename);
});

const PORT = process.env.DB_PORT || 5000

app.listen(PORT, () => {
    console.log("connected")
})
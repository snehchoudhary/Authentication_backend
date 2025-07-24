import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000
connectDB();


const allowedOrigins = ['https://allied-engineers-data-visualization-7x42.onrender.com', 'https://allied-engineers-data-visualization-5t8a.onrender.com' ]
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins,credentials: true}))

//API Endpoints

app.get('/', (req, res) => {
  res.send("API working");
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server started on PORT:${port}`));

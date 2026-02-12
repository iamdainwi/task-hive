import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Task hive server is running!");
})

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
import express, { type Router } from "express";
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = express.Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
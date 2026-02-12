import express, {type Router} from "express";
import {deleteUser, getUser, updateUser} from "../controllers/user.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router: Router = express.Router();

router.get('/me', authMiddleware, getUser);
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteUser);

export default router;
import express, {type Router} from "express";
import {loginUser, registerUser} from "../controllers/auth.controller.js";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
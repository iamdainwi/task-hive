import type {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import type {AuthRequest} from "../types/auth.js";

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({ message: "Authorization required" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send({ message: "Invalid token format" });
        }

        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: string };

        next();
    } catch (err: any) {
        return res.status(401).send({ message: "Invalid or expired token" });
    }
};

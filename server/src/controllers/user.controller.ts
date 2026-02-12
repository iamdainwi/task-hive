import type {Response} from "express";
import type {AuthRequest} from "../types/auth.js";
import {usersTable} from "../schema/schema.js";
import db from "../config/db.js";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];

        return res.status(200).json(user);
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
};


export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, email, password } = req.body;

        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // build update object dynamically
        const updateData: any = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) {
            updateData.password = await bcrypt.hash(password, 8);
        }

        // if no fields provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        await db
            .update(usersTable)
            .set(updateData)
            .where(eq(usersTable.id, userId));

        return res.status(200).json({ message: "User updated successfully" });

    } catch (e: any) {
        return res.status(500).send({ message: e.message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await db
            .delete(usersTable)
            .where(eq(usersTable.id, userId))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });

    } catch (e: any) {
        return res.status(500).send({ message: e.message });
    }
};

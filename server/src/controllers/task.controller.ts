import e, { type Response } from 'express';
import type {AuthRequest} from "../types/auth.js";
import {tasksTable} from "../schema/schema.js";
import db from "../config/db.js";
import {and, eq} from "drizzle-orm";

export const createTask = async(req: AuthRequest, res: Response) => {
    try {
        const {title, description, dueDate} = req.body;
        const userId = req.user?.userId!;

        const task = await db.insert(tasksTable).values({
            user_id: userId,
            title,
            description,
            due_date: dueDate,
        }).returning();

        return res.status(201).json({message: "Task created", task: task});
    }catch (e: any) {
        return res.status(500).send({error: e.message});
    }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const taskId: any = req.params.id;
        const { title, description, dueDate, status } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const updateData: any = {};

        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (dueDate) updateData.due_date = dueDate;
        if (status !== undefined) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        updateData.updated_at = new Date();

        const result = await db
            .update(tasksTable)
            .set(updateData)
            .where(
                and(
                    eq(tasksTable.id, taskId),
                    eq(tasksTable.user_id, userId)
                )
            )
            .returning();

        if (result.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json(result[0]);

    } catch (e: any) {
        return res.status(500).send({ error: e.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const taskId: any = req.params.id;
        const userId = req.user?.userId!;

        const task = await db
            .delete(tasksTable)
            .where(and(eq(tasksTable.id, taskId), eq(tasksTable.user_id, userId))).returning();

        if(task.length === 0) return res.status(404).json({ message: "Task not found" });

        return res.status(200).json({ message: "Task deleted" });
    }catch (e: any) {
        return res.status(500).send({error: e.message});
    }
}

export const getTask = async (req: AuthRequest, res: Response) => {
    try {
        const taskId: any = req.params.id;
        const userId = req.user?.userId!;
        const task = await db
            .select()
            .from(tasksTable)
            .where(and(
                eq(tasksTable.id, taskId),
                eq(tasksTable.user_id, userId)
            ));
        return res.status(200).json({task: task});
    }catch (e: any) {
        return res.status(500).send({error: e.message});
    }
}

export const getAllTasks = async(req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId!;
        const tasks = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.user_id, userId));

        if(tasks.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({tasks: tasks});
    }catch (e: any) {
        return res.status(500).send({error: e.message});
    }
}
import type {Response, Request} from "express";
import {usersTable} from "../schema/schema.js";
import db from "../config/db.js";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async(req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if(existingUser.length > 0) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await db.insert(usersTable).values({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({message: "Account created, please login"});

    }catch (error : string | any | undefined) {
        res.status(500).send({error: error.message});
    }
}

export const loginUser = async(req: Request, res: Response) => {

    try {
        const {email, password} = req.body;

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if(existingUser.length === 0){
            return res.status(400).json({message: "User does not exists"});
        }

        const user = existingUser[0]!;

        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword){
            return res.status(400).json({message: "Either email or password is incorrect"});
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET as string, {expiresIn: '1d'});

        return res.status(200).json({token: token, message: "Successfully logged in"});
    }catch (error : string | any | undefined) {
        res.status(500).send({error: error.message});
    }
}
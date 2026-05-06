import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
// import asyncHandler from 'express-async-handler';
// import User from '../models/userModel.js';

// Read the token from the request
// Check if the token is valid
export const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware reached");
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
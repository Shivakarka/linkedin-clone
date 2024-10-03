import { Request, Response } from 'express';

export const signup = async (req: Request , res: Response) => {
res.send('Signup endpoint');
}

export const login = async (req: Request , res: Response) => {
res.send('Login endpoint');
}

export const logout = async (req: Request , res: Response) => {
res.send('Logout endpoint');
}
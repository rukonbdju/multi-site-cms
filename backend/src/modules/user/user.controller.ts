import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { generateToken } from './user.utils';

const userService = new UserService();

export class UserController {
    // Register a new user
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.registerUser(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            console.error('Register Error:', error);
            if (error.code === '23505') {
                // Unique constraint violation (email)
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
            next(error);
        }
    }

    // Login user
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }

            const user = await userService.authenticate(email, password);
            if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            const token = generateToken({ userId: user?.id })
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ success: true, data: user });
        } catch (error) {
            console.error('Login Error:', error);
            next(error);
        }
    }

    //Logout user
    async logout(_req: Request, res: Response, next: NextFunction) {
        try {
            res.cookie('auth_token', '', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ success: true, message: 'You have successfully logged out.' });
        } catch (error) {
            console.log("logout error", error)
            next(error)
        }
    }

    // Get all users
    async listUsers(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.listUsers();
            res.json({ success: true, data: users });
        } catch (error) {
            console.error('List Users Error:', error);
            next(error);
        }
    }

    // Get user by ID
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid user ID' });

            const user = await userService.getUserById(id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            res.json({ success: true, data: user });
        } catch (error) {
            console.error('Get User Error:', error);
            next(error);
        }
    }

    // Update user
    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid user ID' });

            const updatedUser = await userService.updateUser(id, req.body);
            if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

            res.json({ success: true, data: updatedUser });
        } catch (error: any) {
            console.error('Update User Error:', error);
            if (error.code === '23505') {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
            next(error);
        }
    }

    // Delete user
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid user ID' });

            const deleted = await userService.deleteUser(id);
            if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });

            res.json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete User Error:', error);
            next(error);
        }
    }
}

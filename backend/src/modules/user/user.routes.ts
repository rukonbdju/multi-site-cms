import { Router } from 'express';
import { UserController } from './user.controller';

const userRouter = Router();
const userController = new UserController();

// Public routes
userRouter.post('/', (req, res, next) => userController.register(req, res, next));
userRouter.post('/login', (req, res, next) => userController.login(req, res, next));

// Protected / Admin routes (you can add auth middleware later)
userRouter.get('/', (req, res, next) => userController.listUsers(req, res, next));
userRouter.get('/:id', (req, res, next) => userController.getUserById(req, res, next));
userRouter.put('/:id', (req, res, next) => userController.updateUser(req, res, next));
userRouter.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

export default userRouter;

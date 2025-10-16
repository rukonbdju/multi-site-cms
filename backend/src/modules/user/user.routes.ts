import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', (req, res, next) => userController.register(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));

// Protected / Admin routes (you can add auth middleware later)
router.get('/', (req, res, next) => userController.listUsers(req, res, next));
router.get('/:id', (req, res, next) => userController.getUserById(req, res, next));
router.put('/:id', (req, res, next) => userController.updateUser(req, res, next));
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

export default router;

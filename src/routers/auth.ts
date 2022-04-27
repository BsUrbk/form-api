import express, {Router} from 'express';
import AuthController from '../controllers/AuthController';

const router: Router = express.Router();

const authController = new AuthController;
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

export default router;
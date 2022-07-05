import express, {Router} from 'express';
import AuthController from '../controllers/AuthController';
import Auth from '../middleware/checkJWT';

const router: Router = express.Router();

const authController = new AuthController;
const auth = new Auth;

router.post('/register', auth.checkLogged.bind(auth),authController.register.bind(authController));
router.post('/login', auth.checkLogged.bind(auth), authController.login.bind(authController));
router.post('/logout', auth._checkLogged.bind(auth), auth.checkJWT.bind(auth), authController.logout.bind(authController));

export default router;
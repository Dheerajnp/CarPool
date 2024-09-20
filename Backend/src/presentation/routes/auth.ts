import { Router } from 'express'
import { AuthRepositoryImp } from '../../application/repository/authRepositoryImp'
import { authInteractorImp } from '../../application/usecases/authInteractorImp';
import { authController } from '../controllers/authController';
import { userBlocked, userExistsGoogle } from '../middlewares/authMiddleware';

const repository = new AuthRepositoryImp();
const interactor = new authInteractorImp(repository);
const controller = new authController(interactor);

const authRouter:Router = Router(); 

authRouter.post('/register',controller.register.bind(controller));
authRouter.post('/verifyotp/:userId',controller.verifyOTP.bind(controller));
authRouter.post('/login',controller.login.bind(controller));
authRouter.post('/google-signup',userBlocked,userExistsGoogle,controller.googleLoginService.bind(controller));
authRouter.post('/forgotpassword',controller.forgotPassword.bind(controller));
authRouter.post('/forgot-password/otp',controller.forgotPasswordConfirmation.bind(controller));
authRouter.post('/reset-password',controller.resetPassword.bind(controller));


export default authRouter;
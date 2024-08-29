import { Router } from "express";
import { userRepositoryImp } from "../../application/repository/userRepositoryImp";
import { userInteractorImp } from "../../application/usecases/userInteractorImp";
import { userController } from "../controllers/userController";
import {authMiddleware} from '../middlewares/authMiddleware'

const repository = new userRepositoryImp();
const interactor = new userInteractorImp(repository);
const controller = new userController(interactor);

const userRouter:Router = Router();

userRouter.put('/upload-document/:userId',authMiddleware, controller.uploadDocument.bind(controller));
userRouter.get('/getUser/:userId',authMiddleware,controller.getUserDetails.bind(controller));
userRouter.put('/updateDocument/:userId',authMiddleware,controller.editDocument.bind(controller));
userRouter.put('/updateInfo/:userId',authMiddleware,controller.userInfoEdit.bind(controller));
userRouter.get('/getRides',authMiddleware,controller.getRides.bind(controller));
userRouter.get('/getRideDetails/:rideId',authMiddleware,controller.getRideDetails.bind(controller));
userRouter.get('/notifications',authMiddleware,controller.getUserNotifications.bind(controller));

export default userRouter;
import { Router } from "express";
import { userRepositoryImp } from "../../application/repository/userRepositoryImp";
import { userInteractorImp } from "../../application/usecases/userInteractorImp";
import { userController } from "../controllers/userController";


const repository = new userRepositoryImp();
const interactor = new userInteractorImp(repository);
const controller = new userController(interactor);

const userRouter:Router = Router();

userRouter.put('/upload-document/:userId', controller.uploadDocument.bind(controller));

export default userRouter;
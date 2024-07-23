import { Router } from "express";
import { adminController} from '../controllers/adminController'
import { AdminRepositoryImp } from "../../application/repository/AdminRepositoryImp";
import { adminInteractorImp } from "../../application/usecases/adminInteractor";
const adminRouter:Router = Router();

const repository = new AdminRepositoryImp();
const interactor = new adminInteractorImp(repository);
const controller = new adminController(interactor);

adminRouter.post('/login',controller.adminLogin.bind(controller));
adminRouter.get('/verify',controller.adminVerifyController.bind(controller));
adminRouter.get('/getUsers',controller.getAllUsers.bind(controller));

adminRouter.put('/user-actions/:id/:block',controller.userActions.bind(controller));
adminRouter.put('/license-approval/:userId',controller.licenseApproval.bind(controller))
adminRouter.get('/getUsersPendingApproval',controller.pendingUserDocs.bind(controller));
export default adminRouter;
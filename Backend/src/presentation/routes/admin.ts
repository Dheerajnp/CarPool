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
adminRouter.get('/pendingDrivers',controller.getPendingDrivers.bind(controller));
adminRouter.put('/user-actions/:id/:block',controller.userActions.bind(controller));
adminRouter.put('/license-approval/:userId',controller.licenseApproval.bind(controller))
adminRouter.get('/getUsersPendingApproval',controller.pendingUserDocs.bind(controller));
adminRouter.get('/getPendingVehicles',controller.getPendingVehicles.bind(controller));
adminRouter.patch('/approveVehicle/:driverId/:vehicleId',controller.approveVehicle.bind(controller));
adminRouter.patch('/rejectVehicle/:driverId/:vehicleId',controller.rejectVehicle.bind(controller));
adminRouter.patch('/rejectDocument/:userId',controller.rejectDocument.bind(controller));
adminRouter.patch('/approveDocument/:userId',controller.acceptDocument.bind(controller));
export default adminRouter;
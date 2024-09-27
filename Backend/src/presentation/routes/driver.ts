import { Router } from "express";
import { driverRepositoryImp } from "../../application/repository/DriverRepositoryImp";
import { driverInteractorImp } from "../../application/usecases/driverInteractorImp";
import { driverController } from "../controllers/driverController";
import {authMiddleware} from '../middlewares/authMiddleware'
const repository = new driverRepositoryImp();
const interactor = new driverInteractorImp(repository);
const controller = new driverController(interactor);

const driverRouter: Router = Router();

driverRouter.put('/upload-license/:userId',controller.uploadLicense.bind(controller));
driverRouter.post('/getDriver',authMiddleware,controller.getDriverDetails.bind(controller));
driverRouter.put('/updateProfilePicture',authMiddleware,controller.updateDriverProfilePicture.bind(controller));
driverRouter.post('/saveLicenseInfo',authMiddleware,controller.editLicenseInfo.bind(controller));
driverRouter.post('/updateInfo/:driverId',authMiddleware,controller.editDriverInfo.bind(controller));
driverRouter.put('/addVehicle/:driverId',authMiddleware,controller.addVehicle.bind(controller));
driverRouter.put('/deleteVehicle/:vehicleId',authMiddleware,controller.deleteVehicle.bind(controller));

//ride routes
driverRouter.post('/create-ride/:driverId',authMiddleware,controller.createRide.bind(controller));

//get vehicles
driverRouter.get('/vehicles/:driverId',authMiddleware,controller.getVehicles.bind(controller));
driverRouter.get('/notifications',authMiddleware,controller.getNotifications.bind(controller));
driverRouter.get('/getRideDetails/:rideId',authMiddleware,controller.getRideDetails.bind(controller));
driverRouter.put('/requestAccept/:rideId',authMiddleware,controller.requestAccept.bind(controller));
driverRouter.put('/requestDeny/:rideId',authMiddleware,controller.requestDeny.bind(controller));
driverRouter.put('/updateRideStatus/:rideId',authMiddleware,controller.updateRideStatus.bind(controller));
export default driverRouter;
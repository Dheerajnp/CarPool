import { Router } from "express";
import { driverRepositoryImp } from "../../application/repository/DriverRepositoryImp";
import { driverInteractorImp } from "../../application/usecases/driverInteractorImp";
import { driverController } from "../controllers/driverController";

const repository = new driverRepositoryImp();
const interactor = new driverInteractorImp(repository);
const controller = new driverController(interactor);

const driverRouter: Router = Router();

driverRouter.put('/upload-license/:userId',controller.uploadLicense.bind(controller));
driverRouter.post('/getDriver',controller.getDriverDetails.bind(controller));
driverRouter.post('/saveLicenseInfo',controller.editLicenseInfo.bind(controller));

export default driverRouter;
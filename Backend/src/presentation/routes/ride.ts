import { Router } from 'express'
import { RideRepositoryImp } from '../../application/repository/RideRepositoryImp'
import { RideIntercatorImp } from '../../application/usecases/RideInteractorImp';
import { RideController } from '../controllers/rideController';
import {authMiddleware} from '../middlewares/authMiddleware'

const repository = new RideRepositoryImp();
const interactor = new RideIntercatorImp(repository);
const controller = new RideController(interactor);

const rideRouter:Router = Router();
rideRouter.put('/requestRide/:rideId',authMiddleware,controller.requestRide.bind(controller));
rideRouter.get('/getDriverRides/:driverId',authMiddleware,controller.getRidesDriver.bind(controller));
rideRouter.get('/getUserRides/:userId',authMiddleware,controller.getUserRides.bind(controller));
rideRouter.get('/getRideDetails/:rideId',authMiddleware,controller.getRideDetails.bind(controller));
rideRouter.post('/userOnboarding/:rideId',authMiddleware,controller.userOnboardRide.bind(controller))
export default rideRouter;
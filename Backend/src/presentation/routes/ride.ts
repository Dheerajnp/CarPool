import { Router } from 'express'
import { RideRepositoryImp } from '../../application/repository/RideRepositoryImp'
import { RideIntercatorImp } from '../../application/usecases/RideInteractorImp';
import { RideController } from '../controllers/rideController';

const repository = new RideRepositoryImp();
const interactor = new RideIntercatorImp(repository);
const controller = new RideController(interactor);

const rideRouter:Router = Router();
rideRouter.put('/requestRide/:rideId',controller.requestRide.bind(controller));
rideRouter.get('/getDriverRides/:driverId',controller.getRidesDriver.bind(controller));
rideRouter.get('/getUserRides/:userId',controller.getUserRides.bind(controller));
export default rideRouter;
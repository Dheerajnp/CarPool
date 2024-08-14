import { Application } from "express";
import userRouter from "../../presentation/routes/user"
import authRouter from "../../presentation/routes/auth";
import driverRouter from "../../presentation/routes/driver"
import adminRouter from "../../presentation/routes/admin"
import rideRouter from "../../presentation/routes/ride"
const routes:Function = (app:Application)=>{
    app.use('/',authRouter);
    app.use('/user',userRouter);
    app.use('/driver',driverRouter);
    app.use('/ride',rideRouter);
    app.use('/admin',adminRouter)
}

export default routes;
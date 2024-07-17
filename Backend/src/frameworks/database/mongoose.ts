import mongoose , { Mongoose } from 'mongoose';
import { ConfigInterface } from '../../config/config'
const mongooseConfig:Function = (config:ConfigInterface) =>{
    mongoose.connect(config.MONGO).then(() => console.log("Connected to Database"))
}

export default mongooseConfig
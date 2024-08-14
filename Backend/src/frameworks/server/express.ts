import cors from 'cors'
import morgan from 'morgan'
import express,{Application} from 'express'
import { env } from '../../config/config';

const expressConfig:Function = (app:Application)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended:true}))
    app.use(morgan('dev'));
    app.use(cors({
        origin:env.VITE_ORIGIN,
        credentials:true,
    }))
}
export default expressConfig;
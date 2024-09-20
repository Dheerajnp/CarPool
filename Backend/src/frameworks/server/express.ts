import cors from 'cors'
import morgan from 'morgan'
import express,{Application} from 'express'
import { env } from '../../config/config';
import path from 'path';

const expressConfig:Function = (app:Application)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended:true}))
    app.use('/assets',express.static(path.join(__dirname,'assets')))
    app.use(morgan('dev'));
    app.use(cors({
        origin:env.VITE_ORIGIN,
        credentials:true,
    }))
}
export default expressConfig;
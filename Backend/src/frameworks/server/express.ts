import cors from 'cors'
import morgan from 'morgan'
import express,{Application} from 'express'

const expressConfig:Function = (app:Application)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended:true}))
    app.use(morgan('dev'));
    app.use(cors({
        origin:'http://localhost:5173',
        credentials:true,
    }))
}
export default expressConfig;
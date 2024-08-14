import express, {Application} from 'express';
import { ConfigInterface } from '../../config/config'
function server(config:ConfigInterface):Application{
    const app:Application = express();
    return app;
}

export default server;
import express, {Application} from 'express';
import { ConfigInterface } from '../../config/config'
function server(config:ConfigInterface):Application{
    const app:Application = express();
    app.listen(config.PORT,()=>{
        console.log(`Server running on port ${config.PORT}`);
    })
    return app;
}

export default server;
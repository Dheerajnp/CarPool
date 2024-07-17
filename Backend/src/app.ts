import config from './config/config';
import mongooseConfig from './frameworks/database/mongoose';
import expressConfig from './frameworks/server/express';
import routes from './frameworks/server/routes';
import server from './frameworks/server/server';

const app:Function = server(config);
expressConfig(app);
mongooseConfig(config);
routes(app);

export default app;


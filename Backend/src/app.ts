import { Application } from "express";
import config from "./config/config";
import mongooseConfig from "./frameworks/database/mongoose";
import expressConfig from "./frameworks/server/express";
import routes from "./frameworks/server/routes";
import server from "./frameworks/server/server";
import httpServer from "./frameworks/server/http";
import {initializeSocketServer} from "./frameworks/server/socket"
const app: Application = server(config);
const http = httpServer(app);
expressConfig(app);
initializeSocketServer(http);
mongooseConfig(config);
routes(app);
export default app;

import { createServer } from "http";
import { Application } from "express";
import config from "../../config/config";
export default function httpServer(app: Application) {
  const httpServer = createServer(app);
  httpServer.listen(config.PORT, () => {
    console.log("Server started on port " + config.PORT);
  });
  return httpServer;
}

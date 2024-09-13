import { NextFunction, Request, Response,RequestHandler} from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { configuredKeys } from "../../config/config";

declare global {
    namespace Express{

        interface Request {
            userId?: string;
            role?: string;
        }
    }
}
export const authMiddleware:RequestHandler = async(req:Request, res:Response, next:NextFunction)=>{
   try {
        const token = req.headers["authorization"];
        const accessToken = token?.split(" ")[1];
        const decodedToken = jwt.verify(accessToken as string ,configuredKeys.JWT_SECRET_KEY) as JwtPayload;
        if(!decodedToken){
            return res.status(401).json({message:"Invalid token", status:403});
        }
        req.role = decodedToken.role;
        req.userId = decodedToken.userID;
        next();
   } catch (error) {
        console.log(error);
        return res.status(401).json({message:"Invalid token", status:403});
   }
    
}
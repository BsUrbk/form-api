import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";

class Auth{
    public async checkJWT(req: Request, res: Response, next: NextFunction){
        try{
            await jwt.verify(req.cookies.TOKEN, process.env.SECRET as string);
            return next();
        }catch(e){
            return res.json("You need to log in to view this content");
        }
    }
    public checkLogged(req: Request, res: Response, next: NextFunction){
        if(req.cookies.TOKEN && jwt.verify(req.cookies.TOKEN, process.env.SECRET as string)){
            return res.json("You are already logged in");
        }else{
            return next();
        }
    }
    public _checkLogged(req: Request, res: Response, next: NextFunction){
        if(req.cookies.TOKEN && jwt.verify(req.cookies.TOKEN, process.env.SECRET as string)){
            return next();
        }else{
            return res.json("You're not logged in");
        }
    }
}

export default Auth;
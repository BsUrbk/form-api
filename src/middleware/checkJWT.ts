import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";

class Auth{
    public async checkJWT(req: Request, res: Response, next: NextFunction){
        try{
            await jwt.verify(req.cookies.TOKEN, "buba");
            return next();
        }catch(e){
            return res.json("Nice try, but no");
        }
    }
    public checkLogged(req: Request, res: Response, next: NextFunction){
        if(req.cookies.TOKEN && jwt.verify(req.cookies.TOKEN, "buba")){
            return res.json("You are already logged in")
        }else{
            return next();
        }
    }
}

export default Auth;
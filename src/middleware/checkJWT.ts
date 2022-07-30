import {Request, Response, NextFunction} from 'express';
import RefreshToken from '../models/RefreshToken.model';
import jwt from "jsonwebtoken";

class Auth{
    public async checkJWT(req: Request, res: Response, next: NextFunction){
        try{
            jwt.verify(req.cookies.TOKEN, process.env.SECRET as string);
            return next();
        }catch(e){
            return res.json("You need to log in to view this content");
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction){
        let expired = false;
        let verify = false;

        try{
            jwt.verify(req.cookies.TOKEN, process.env.SECRET as string);
            jwt.verify(req.cookies.REFRESH_TOKEN, process.env.SECRET as string);
            verify = true;
        }catch{
            verify = false;
        }

        try{
            jwt.verify(req.cookies.REFRESH_TOKEN, process.env.SECRET as string);
        }catch{
            expired = true;
        }

        if(expired){
            const username = await RefreshToken.getTokenUser(req.cookies.REFRESH_TOKEN.token);
            const newToken = username ? jwt.sign({user: username}, process.env.SECRET as string, {
                expiresIn: '30m',
                algorithm: 'HS256'
            }) : undefined
            
            if(newToken){
                res.locals.token = newToken
                res.cookie("TOKEN", newToken, {
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + 60000) //(1800 * 1000)
                }) 
                return next()
            }else{
                return res.sendStatus(404)
            }
        }else if(verify){
            return next()
        }
        return res.json({response: "You're not logged in"})
    }

    public checkLogged(req: Request, res: Response, next: NextFunction){
        if(req.cookies.TOKEN && jwt.verify(req.cookies.TOKEN, process.env.SECRET as string)){
            return res.json("You are already logged in");
        }else{
            return next();
        }
    }
    public _checkLogged(req: Request, res: Response, next: NextFunction){
        if(req.cookies.TOKEN || res.locals.token){
            try{
                jwt.verify(req.cookies.TOKEN, process.env.SECRET as string)
            }catch(err){
                const verify = jwt.verify(res.locals.token, process.env.SECRET as string)
                return verify ? next() : res.json({response: "HOW"})
            }
            return next()
        }else{
            return res.json("You're not logged in")
        }
    }
}

export default Auth;
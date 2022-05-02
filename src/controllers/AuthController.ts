import User from '../models/User.model';
import {Request, Response, NextFunction} from 'express';
import { time } from 'console';

class AuthController{
    public async register(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const result = await new User(data).createUser().catch(next);
        if(result){
            return res.json({response: "User successfully registered", result});
        }else{
            return res.json({response: "Username or email is already taken"});
        }
    }
    
    public async login(req: Request, res: Response, next: NextFunction){
        const { username, password } = req.body;
        const result = await User.login({ username, password }).catch(next);
        
        if(result){
            console.log(result);
            return res.cookie("TOKEN", result.token,{
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (1800 * 1000))
            }).cookie("REFRESH_TOKEN", result.RToken, {
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (3600 * 1000 * 24 * 30))
            }).sendStatus(200);
        }else{
            return res.json({response: "Username or password is incorrect", result});
        }
        
    }

    public async logout(req: Request, res: Response, next: NextFunction){
        return res.cookie("TOKEN", "", {
            secure: false,
            httpOnly: true,
            expires: new Date(Date.now()-3600)
        }).sendStatus(200);
    }
}
export default AuthController;

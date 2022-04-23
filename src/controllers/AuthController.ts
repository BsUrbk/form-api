import User from '../models/User.model';
import {Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';

class AuthController{
    public async register(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const user = await new User(data).createUser().catch(next);
        if(user){
            return res.json({response: "User successfully registered", user});
        }
    }
    
    public async login(req: Request, res: Response, next: NextFunction){
        const { username, password } = req.body;
        const result = await User.login({ username, password }).catch(next);
        
        if(result){
            console.log(result);
            return res.cookie("token", result,{
                secure: false,
                httpOnly: true
            }).sendStatus(200);
        }else{
            return res.json({response: "Username or password is incorrect", result});
        }
        
    }
}
export default AuthController;
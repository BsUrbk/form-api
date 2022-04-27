import User from '../models/User.model';
import {Request, Response, NextFunction} from 'express';

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
}
export default AuthController;

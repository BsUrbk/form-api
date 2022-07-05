import User from '../models/User.model';
import {Request, Response, NextFunction} from 'express';
import registerSchema from '../schemas/register.schema.json';
import loginSchema from '../schemas/login.schema.json';
import schemaValidator from '../middleware/schemaValidator';

class AuthController{
    public async register(req: Request, res: Response, next: NextFunction){
        const data = req.body;
        const validate = await schemaValidator.validate(registerSchema, data);
        const result = validate ? await new User(data).createUser().catch(next) : undefined;
        
        return result ? res.json({response: "User successfully registered", result}) : res.json({response: "Username/e-mail is incorrect"});
    }
    
    public async login(req: Request, res: Response, next: NextFunction){
        const { username, password } = req.body;
        const validate = await schemaValidator.validate(loginSchema, req.body);
        const result = validate ? await User.login({ username, password }).catch(next) : undefined;
        
        if(result){
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

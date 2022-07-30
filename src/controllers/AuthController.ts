import User from '../models/User.model';
import Owner from '../models/Owner.model';
import {Request, Response, NextFunction} from 'express';
import registerSchema from '../schemas/register.schema.json';
import loginSchema from '../schemas/login.schema.json';
import schemaValidator from '../middleware/schemaValidator';
import RefreshToken from '../models/RefreshToken.model';
import jwt from 'jsonwebtoken';

class AuthController{
    public async clear(req: Request, res: Response, next: NextFunction){
        await User.deleteAll()
        return res.json({ response: "done" })
    }

    public async register(req: Request, res: Response, next: NextFunction){
        let data = req.body;
        const lookForOwner = data.ref ? await Owner.getOwner(data.ref) : true;
        const validate = await schemaValidator.validate(registerSchema, data);
        if(validate && lookForOwner){
            const user = await new User(data).createUser().catch(next);
            return user ? res.json({ response: "User successfully registered" }) : res.json({ response: "Error occured" });
        }else if(validate && !lookForOwner){
            return res.json( {response: "Invalid affiliate" });
        }else if(!validate){
            return res.json({ response: "Username or e-mail is invalid"});
        }else{
            return res.json({ response: "Error occured" })
        }
    }
    
    public async login(req: Request, res: Response, next: NextFunction){
        const { username, password } = req.body;
        const validate = await schemaValidator.validate(loginSchema, req.body);
        const result = validate ? await User.login({ username, password }).catch(next) : undefined;
        
        if(result){
            return res.cookie("TOKEN", result.token,{
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + (1800 * 1000)) //(1800 * 1000)
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
        if((req.cookies.REFRESH_TOKEN && req.cookies.TOKEN) || (req.cookies.REFRESH_TOKEN && res.locals.token)){
            try{
                jwt.verify(req.cookies.TOKEN, process.env.SECRET as string)
            }catch(err){
                jwt.verify(res.locals.token, process.env.SECRET as string)
            }
            await RefreshToken.DeleteToken(req.cookies.REFRESH_TOKEN.token)
        }else{
            return res.json({response: "Invalid json web tokens"})
        }
        return res.cookie("TOKEN", "",{
            secure: false,
            httpOnly: true,
            expires: new Date(Date.now() - 3600)
        }).cookie("REFRESH_TOKEN", "",{
            secure: false,
            httpOnly: true,
            expires: new Date(Date.now() - 3600)
        }).sendStatus(200)
    }
}
export default AuthController;

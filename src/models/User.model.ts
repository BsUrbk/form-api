import Model from "./Model";
import IUser from "../types/IUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RefreshToken from "./RefreshToken.model";
import { randomBytes } from "crypto";
import { rejects } from "assert";
import { resolve } from "path";

class User extends Model {
    private firstName : string;
    private lastName : string;
    private email : string;
    private username : string;
    private password : string;

    constructor({firstName, lastName, email, username, password}: IUser){
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public static async login({username, password}: {username: string, password: string}){
        const user = await User.getUserByUsername(username);
        if(!user){
            return false;  
        }else{
            const validate = await bcrypt.compare(password, user.password);
            if(validate){
                let RToken = await new RefreshToken(user.id).CreateToken();
                let token = jwt.sign({user: username}, process.env.SECRET as string, {
                    expiresIn: '30m',
                    algorithm: "HS256"
                });
                return {token, RToken};
            }
        }
    }

    public static async getUserId(username: string){
        const prisma = User.getPrisma();

        const id = await prisma.user.findUnique({ where: { username }, select:{id: true} })
        .catch(err => { throw console.log(err)});

        return id;
    }

    public static async checkPassword(password: string, hashed: string){
        bcrypt.compare(password, hashed, (err, result) =>{
            return result;
        })
    }

    public static async getUserByUsername(username: string){
        const prisma = User.getPrisma();
        if(username === undefined){
            console.log("Undefined fields");
        }
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                password: true
            }
        }).catch(err => { throw console.log(err) });
        return user;
    }

    public async createUser(){
        const prisma = User.getPrisma();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        const user = await prisma.user.create({
            data: {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                username: this.username,
                password: this.password
            }
        }).catch(err => {console.log(err)});
        return user;
    }

    public async getUsers(){
        const prisma = User.getPrisma();

    }
}

export default User;
import Model from "./Model";
import jwt from "jsonwebtoken";
import prismaException from "../exceptions/prismaException";

class RefreshToken extends Model{ 
    constructor(private userId: string) {
        super();
    }

    public async CreateToken(){
        const token = jwt.sign({ id: this.userId } , process.env.SECRET as string,{
            expiresIn: '30d',
            algorithm: "HS256"
        })
        const prisma = RefreshToken.getPrisma();
        const RToken = await prisma.refreshToken.create({
            data: {
                token, 
                userId: this.userId },
            }).catch((err) => { throw new prismaException(err) });
        return RToken;
    }

    public static async DeleteToken(id: string){
        const prisma = RefreshToken.getPrisma();
        const deletedRefreshToken = await prisma.refreshToken.delete({
            where: { id },
            }).catch((err) => { throw new prismaException(err) });
        return deletedRefreshToken;
    }

    public async getTokenId(){
        const prisma = RefreshToken.getPrisma();
        const id = await prisma.refreshToken.findFirst({
            where: { userId: this.userId}, 
            select: {id: true}
        }).catch(err => { throw new prismaException(err) });
        return id;
    }
}

export default RefreshToken;

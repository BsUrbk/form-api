import Model from "./Model";
import jwt from "jsonwebtoken";

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
            }).catch((err) => {throw console.log(err)});
        return RToken;
    }

    public static async DeleteToken(id: string){
        const prisma = RefreshToken.getPrisma();
        const deletedRefreshToken = await prisma.refreshToken.delete({
            where: { id },
            }).catch((err) => {throw console.log(err)});
        return deletedRefreshToken;
    }
}

export default RefreshToken;

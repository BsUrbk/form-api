import prismaException from "../exceptions/prismaException";
import Model from "./Model";

class Owner extends Model{
    public static async getOwner(ref: string){
        const prisma = Owner.getPrisma();
        const owner = await prisma.owner.findUnique({
            where: { ref },
            select: { id: true }
        }).catch(err => { throw new prismaException(err) })

        return owner ? true : false;
    }
}

export default Owner;
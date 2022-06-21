import { PrismaClient, Prisma } from "@prisma/client";
import Model from "../models/Model";

const client = new PrismaClient();

class prismaException extends Model{
    constructor(private err: string){
        super();
    }

    public async prismaException(err: any){
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            switch(err.code){
                case 'P2000':
                    return JSON.stringify({ error: "Credentials exceed character limit" });
                case 'P2001':
                    return JSON.stringify({ error: "User does not exists" });
                case 'P2002':
                    return JSON.stringify({ error: "Username is taken" });
            }
        }
    }
}
    
export default prismaException;

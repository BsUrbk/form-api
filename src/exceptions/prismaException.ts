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
                case 'P1008' :
                    return JSON.stringify({ error: "Timed out, please try again in a moment" });
                case 'P2000':
                    return JSON.stringify({ error: "Credentials exceed character limit" });
                case 'P2001':
                    return JSON.stringify({ error: "User doesn't exist" });
                case 'P2002':
                    return JSON.stringify({ error: "Username is taken" });
                case 'P2027':
                    return JSON.stringify({ error: `Multiple errors occured... how?`})
            }
        }
    }
}
    
export default prismaException;

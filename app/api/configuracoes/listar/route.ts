
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const config = await prisma.config.findMany({     
        where: {
            value: {notIn: ['-1', '-1.00']},
            AND:{
                key: {contains: "ZENY"}
            }
        }
    });
    return Response.json(config)
}

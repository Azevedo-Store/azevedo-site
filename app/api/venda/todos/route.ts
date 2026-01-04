
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {

        const menu = await prisma.vendaHome.findMany({

            orderBy: { ordem: 'asc' },
            where: {
                deleted: false,
                enabled: true,
                tenant: {
                    id: 1
                },
            },
        });
        return Response.json(menu)
    } catch (ex) {
        console.log(ex)
    }
    return Response.json([])
}

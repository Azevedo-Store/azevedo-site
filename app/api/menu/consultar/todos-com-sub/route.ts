
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {

        const menu = await prisma.menu.findMany({
            where:{
                enabled: true,
                deleted: false
            },
            include: {
                sub_menus: true
            },
            orderBy: { ordem: "asc" }
        });
        return Response.json(menu)
    } catch (ex) {
        console.log(ex)
    }
    return Response.json([])
}

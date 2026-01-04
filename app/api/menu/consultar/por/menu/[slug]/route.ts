
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    try {

        const menu = await prisma.menu.findFirst({
            where: {
                slug: slug

            }

        });

        return Response.json(menu)
    } catch (ex) {
        console.log(ex)
    }
    return Response.json([])
}
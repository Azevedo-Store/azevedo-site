
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ subSlug: string }> }) {
    const subSlug = (await params).subSlug;
    try {

        const menu = await prisma.sub_Menu.findFirst({
            where: {
                slug: subSlug
            }
        });

        return Response.json(menu)
    } catch (ex) {
        console.log(ex)
    }
    return Response.json([])
}
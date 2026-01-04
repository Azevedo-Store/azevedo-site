
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ slug: string, subSlug: string }> }) {
    const slug = (await params).slug;
    const subSlug = (await params).subSlug;
    const consulta: any = {
        deleted: false,
        enabled: true,
        menu_itens: {
            some: {
                menu: {
                    slug: slug
                }
            }
        }
    }
    if (subSlug != null && subSlug != undefined && subSlug != "") {
        consulta['AND'] = {
            sub_menu_itens: {
                some: {
                    sub_menus: {
                        slug: subSlug
                    }
                }
            }
        }
    }
    try {

        const menu = await prisma.itens.findMany({
            where: consulta,
            include: {
                image_itens: {
                    include: { image: true }
                }
            }
        });

        return Response.json(menu)
    } catch (ex) {
        console.log(ex)
    }
    return Response.json([])
}

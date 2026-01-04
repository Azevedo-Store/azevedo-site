
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    try {
        const menu = await prisma.itens.findMany({
            where: {
                deleted: false,
                enabled: true,
                menu_itens: {
                    some: {
                        menu: {
                            slug: slug
                        }
                    }
                },
            },
            include: {
                menu_itens: {
                    include: { menu: true }
                },
                sub_menu_itens: {
                    include: { sub_menus: true }
                },
                image_itens: {
                    include: {
                        image: true
                    }
                }
            }
        });
        return Response.json(menu)

    } catch (ex) {
        console.log(ex)
    }
    return Response.json([])

}

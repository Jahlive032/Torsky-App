"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { CopyCard } from "./schema";

const handler = async(data: InputType) : Promise<ReturnType> =>{

    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            error: "Pas autorisé",
        }
    }

    const { id, boardId } = data;
    let card;

    try{
        const cardCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    }
                }
            }
        })

        if(!cardCopy){
            return { error: "Aucune carte trouvée"}
        }

        const lastCard = await db.card.findFirst({
            where: { listId: cardCopy.listId},
            orderBy: { order: "desc"},
            select: { order: true}
        });

        const newOrder = lastCard ? lastCard.order + 1 :1;

        card = await db.card.create({
            data: {
                title: `${cardCopy.title} - Copie`,
                description: cardCopy.description,
                order: newOrder,
                listId: cardCopy.listId,
            }
        })

    } catch(error) {
        return {
            error: "Le tableau n'a pas pu être copié"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card }
}

export const copyCard = createSafeAction(CopyCard, handler);
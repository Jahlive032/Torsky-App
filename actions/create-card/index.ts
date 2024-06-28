"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { CreateCard } from "./schema";

const handler = async(data: InputType) : Promise<ReturnType> =>{

    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            error: "Pas autorisé"
        }
    }

    const { title, boardId, listId } = data;

    let card;

    try{
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId,
                }
            }
        })

        if(!list){
            return {
                error: "Liste introuvable"
            };
        };

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { order: "desc"},
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                title,
                listId,
                order: newOrder,
            }
        });

    } catch(error){
        return{
            error: "Impossible d'ajouter"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card }
}
export const createCard = createSafeAction(CreateCard, handler);
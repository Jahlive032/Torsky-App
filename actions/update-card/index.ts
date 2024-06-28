"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { UpdateCard } from "./schema";

const handler = async(data: InputType) : Promise<ReturnType> =>{

    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            error: "Pas autorisé",
        }
    }

    const { id, boardId, ...values } = data;
    let card;

    try{
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    }
                }
            },
            data: {
                ...values,
            }
        })
    } catch(error) {
        return {
            error: "Echec de mise à jour"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: card}
}

export const updateCard = createSafeAction(UpdateCard, handler);
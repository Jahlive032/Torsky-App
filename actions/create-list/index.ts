"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { CreateList } from "./schema";

const handler = async(data: InputType) : Promise<ReturnType> =>{

    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            error: "Pas autorisé"
        }
    }

    const { title, boardId } = data;

    let list;

    try{
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId,
            }
        });

        if(!board){
            return{
                error:"Aucun tableau trouvé"
            }
        }

        const lastList = await db.list.findFirst({
            where: { boardId: boardId},
            orderBy: { order: "desc"},
            select: { order: true}
        });

        const newOrder = lastList ? lastList.order + 1: 1;

        list = await db.list.create({
            data: {
                title,
                boardId,
                order: newOrder,
            }
        })
    } catch(error){
        return{
            error: "Impossible d'ajouter"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list }
}
export const createList = createSafeAction(CreateList, handler);
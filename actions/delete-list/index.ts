"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { DeleteList } from "./schema";

const handler = async(data: InputType) : Promise<ReturnType> =>{

    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            error: "Pas autorisé",
        }
    }

    const { id, boardId } = data;
    let list;

    try{
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                }
            },
        })
    } catch(error) {
        return {
            error: "Le tableau n'a pas pu être supprimé"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list }
}

export const deleteList = createSafeAction(DeleteList, handler);
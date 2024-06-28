"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { UpdateList } from "./schema";

const handler = async(data: InputType) : Promise<ReturnType> =>{

    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            error: "Pas autorisé",
        }
    }

    const { title, id, boardId } = data;
    let list;

    try{
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                }
            },
            data: {
                title,
            }
        })
    } catch(error) {
        return {
            error: "Echec de mise à jour"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: list}
}

export const updateList = createSafeAction(UpdateList, handler);
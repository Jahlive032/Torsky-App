"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/createSafeAction";
import { CreateBoard } from "./schema";

const handler = async(data: InputType) : Promise<ReturnType> =>{

    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return{
            error: "Pas autorisé"
        }
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
    ] = image.split("|");

    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML){
        return{
            error:"Il y a des éléments manquants pour créer le tableau"
        }
    }

    let board;

    try{
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML
            }
        })
    } catch(error){
        return{
            error: "Impossible d'ajouter"
        }
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board }
}
export const createBoard = createSafeAction(CreateBoard, handler);
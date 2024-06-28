import { z } from "zod";

export const CreateList = z.object({
    title: z.string({
        required_error: "Le titre est requis",
        invalid_type_error: "Le titre est requis",
    }).min(3, {
        message: "Ce titre est trop court"
    }), 
    boardId: z.string(),
});
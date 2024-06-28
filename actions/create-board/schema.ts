import { z } from "zod";

export const CreateBoard = z.object({
    title: z.string({
        required_error: "Le titre est requis",
        invalid_type_error: "Le titre est requis",
    }).min(3, {
        message: "Ce titre est trop court"
    }), 
    image: z.string({
        required_error: "Une image est requise",
        invalid_type_error: "Une image est requise"
    })
})
import { z } from "zod";

export const UpdateCard = z.object({
    boardId: z.string(),
    description: z.optional(
        z.string({
            required_error: "La description est requise",
            invalid_type_error: "La description est requise",
        }).min(3, {
            message: "La description doit contenir au moins 3 caractères",
        })
    ),
    title: z.optional(z.string({
        required_error: "Le titre est requis",
        invalid_type_error: "Le titre est requis",
    }).min(3, {
        message: "Le titre est trop court",
    })),
    id: z.string(),
})
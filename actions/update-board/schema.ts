import { z } from "zod";

export const UpdateBoard = z.object({
    title: z.string({
        required_error: "Le titre est requis",
        invalid_type_error: "Le titre est requis",
    }).min(3, {
        message: "Le titreest trop court",
    }),
    id: z.string(),
})
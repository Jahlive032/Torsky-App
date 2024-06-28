"use client"

import { updateCard } from "@/actions/update-card";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/formSubmit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/useAction";
import { CardWithList } from "@/types"
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescriptionProps {
    data: CardWithList;
}

export const Description = ({data}: DescriptionProps) =>{

    const params = useParams();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const enableEditing = () =>{
        setIsEditing(true);
        setTimeout(() =>{
            textareaRef.current?.focus();
        })
    }

    const disableEditing = () =>{
        setIsEditing(false);
    }

    const onKeyDown = (e: KeyboardEvent) =>{

        if(e.key === "Escape"){
            disableEditing();
        }
    }

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const { execute, fieldErrors } = useAction(updateCard, {

        onSuccess:(data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            toast.success(`La carte "${data.title}" a été mise à jour`);
            disableEditing();
        },
        onError:(error) => {
            toast.error(error);
        },
    })

    const onSubmit = (formData: FormData) =>{

        const description = formData.get("description") as string;
        const boardId = params.boardId as string;

        execute({ id: data.id, description, boardId})
    }

    return(
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700"/>
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Description
                </p>
                {isEditing ? (
                    <form ref={formRef} className="space-y-2" action={onSubmit}>
                        <FormTextarea
                            id="description"
                            className="w-full mt-2"
                            placeholder="Ajouter des détails..."
                            defaultValue={data.description || undefined}
                            errors={fieldErrors}
                            ref={textareaRef}
                        />
                        <div className="flrx items-center gap-x-2">
                            <FormSubmit>Enregistrer</FormSubmit>
                            <Button
                                type="button"
                                onClick={disableEditing}
                                size="sm"
                                variant="ghost"
                            >
                                Supprimer
                            </Button>
                        </div>
                    </form>
                    ) : (
                    <div role="button" className="min-h-[78px] bg-neutal-200 text-sm font-medium py-3 px-3.5 rounded-md" onClick={enableEditing}>
                        {data.description || "Ajouter des détails..."}
                    </div>    
                )}
                
            </div>
        </div>
    )
}

Description.Skeleton = function DescriptionSkeleton(){

    return(
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200"/>
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2 bg-neutal-200"/>
                <Skeleton className="w-full h-[78px] bg-neutal-200"/>
            </div>
        </div>
    )
}
"use client"

import { Plus, X } from "lucide-react"
import { ListWrapper } from "./list-wrapper"
import { ElementRef, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { FormInput } from "@/components/form/form-input"
import { useParams, useRouter } from "next/navigation"
import { FormSubmit } from "@/components/form/formSubmit"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/useAction"
import { createList } from "@/actions/create-list"
import { toast } from "sonner"

export const ListForm = () => {

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const params = useParams();
    const router = useRouter();

    const enableEditing = () =>{
        setIsEditing(true);
        setTimeout(() =>{
            inputRef.current?.focus();
        });
    };

    const disableEditing = () =>{
        setIsEditing(false);
    }

    const { execute, fieldErrors } = useAction(createList, {
        onSuccess: (data) => {
            toast.success(`La liste "${data.title}" a été créé`);
            disableEditing();
            router.refresh();
        },
        onError(error) {
            toast.error(error);
        },
    })

    const onKeyDown = (e: KeyboardEvent) =>{
        if(e.key === "Escape"){
            disableEditing();
        }
    }

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {

        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;

        execute({ title, boardId })
    }

    if(isEditing){
        return (
            <ListWrapper>
                <form ref={formRef} className="w-full p-3 rounded-md bg-white space-y-4 shadow-md" action={onSubmit}>
                    <FormInput
                        errors={fieldErrors}
                        ref={inputRef}
                        id="title"
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                        placeholder="Donnez un titre à la liste..."
                    />
                    <input
                        hidden
                        value={params.boardId}
                        name="boardId"
                    />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Ajouter une liste
                        </FormSubmit>
                        <Button 
                            onClick={disableEditing}
                            size="sm"
                            variant="ghost"
                        >
                            <X className="h-5 w-5"/>
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }


    return(
        <ListWrapper>
            <button className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm" onClick={enableEditing}>
                <Plus className="w-4 h-4 mr-2"/>
                Ajouter une liste
            </button>
        </ListWrapper>
    )
}
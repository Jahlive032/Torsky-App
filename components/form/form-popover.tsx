"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose
} from "@/components/ui/popover";

import { useAction } from "@/hooks/useAction";
import { createBoard } from "@/actions/create-board";
import {FormInput } from "./form-input";
import {FormSubmit } from "./formSubmit";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";

interface FormPopoverProps{
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover = ({children, side = "bottom", align, sideOffset = 0} : FormPopoverProps) =>{

    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) =>{
            console.log({data});
            toast.success("Un tableau a été créé");
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError(error) {
            console.log({error});
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) =>{
        
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        console.log({image});
        execute({title, image});
    }

    return(
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Créer un tableau
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 border-none"
                        variant="ghost"
                    >
                        <X className="w-4 h-4 border-none"/>
                    </Button>
                </PopoverClose>
                <form className="space-y-4" action={onSubmit}>
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors}
                        />
                        <FormInput 
                            label="Titre du tableau"
                            id="title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">
                        Créer
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )

}
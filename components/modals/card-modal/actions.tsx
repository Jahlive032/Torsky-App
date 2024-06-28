"use client"

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { useCardModal } from "@/hooks/use-card-modal";
import { useAction } from "@/hooks/useAction";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
    data: CardWithList;
}

export const Actions = ({data} : ActionsProps) =>{

    const params = useParams();

    const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard,{
        onSuccess:(data) => {
            toast.success(`La carte "${data.title} a été copié "`);
            cardModal.onClose();
        },
        onError:(error) => {
            toast.error(error);
        },
    });

    const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
        onSuccess:(data) => {
            toast.success(`La carte "${data.title}" a été supprimé `);
            cardModal.onClose();
        },
        onError(error) {
            toast.error(error);
        },
    });
    const cardModal = useCardModal();

    const onCopy = () =>{
        const boardId = params.boardId as string;

        executeCopyCard({
            id: data.id,
            boardId: boardId
        })
    }

    const onDelete = () =>{
        const boardId = params.boardId as string;

        executeDeleteCard({
            id: data.id,
            boardId: boardId
        })
    }

    return(
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">
                Actions
            </p>
            <Button
                onClick={onCopy}
                disabled={isLoadingCopy}
                variant="gray"
                className="w-full justify-start"
                size="inline"
            >
                <Copy className="h-4 w-4 mr-2"/> Copier
            </Button>
            <Button
                onClick={onDelete}
                disabled={isLoadingDelete}
                variant="gray"
                className="w-full justify-start"
                size="inline"
            >
                <Trash className="h-4 w-4 mr-2"/> Supprimer
            </Button>
        </div>
    )
}

Actions.Skeleton = function ActionsSkeleton (){

    return(
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
        </div>
    )
}
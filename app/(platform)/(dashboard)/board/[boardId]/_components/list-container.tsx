"use client"

// Importation des types et composants nécessaires
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/useAction";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
};

// Fonction pour réorganiser les éléments d'une liste
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list); // Crée une copie de la liste
    const [removed] = result.splice(startIndex, 1); // Retire l'élément à startIndex
    result.splice(endIndex, 0, removed); // Insère l'élément à endIndex

    return result; // Renvoie la nouvelle liste réorganisée
}

// Composant principal ListContainer
export const ListContainer = ({ data, boardId }: ListContainerProps) => {

    const [orderedData, setOrderedData] = useState(data); // État pour stocker les données réorganisées

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () =>{
            toast.success("La liste a été réordonnée");
        },
        onError(error) {
            toast.error(error);
        },
    })

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () =>{
            toast.success("La carte a été réordonnée");
        },
        onError(error) {
            toast.error(error);
        },
    })

    // Effet pour mettre à jour l'état lorsque les données changent
    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    // Fonction appelée à la fin d'une opération de glisser-déposer
    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        // Si pas de destination, on ne fait rien
        if (!destination) {
            return;
        }

        // Si la destination est la même que la source, on ne fait rien
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // Si le type de l'élément déplacé est une liste
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index,
            ).map((item, index) => ({ ...item, order: index }));

            setOrderedData(items); // Met à jour l'état avec les listes réorganisées
            executeUpdateListOrder({ items, boardId});
        }

        // Si le type de l'élément déplacé est une carte
        if (type === "card") {
            let newOrderedData = [...orderedData]; // Copie des données actuelles

            // Trouve les listes source et destination
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destList) {
                return; // Si l'une des listes n'est pas trouvée, on ne fait rien
            }

            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            if (!destList.cards) {
                destList.cards = [];
            }

            // Si on déplace la carte dans la même liste
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index,
                );

                // Met à jour l'ordre des cartes
                reorderedCards.forEach((card, idx) => {
                    card.order = idx;
                });

                sourceList.cards = reorderedCards;
                setOrderedData(newOrderedData); // Met à jour l'état avec les cartes réorganisées dans la même liste
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: reorderedCards,
                })
            } else {
                // Si on déplace la carte dans une autre liste
                const [movedCard] = sourceList.cards.splice(source.index, 1); // Retire la carte de la liste source
                movedCard.listId = destination.droppableId; // Met à jour l'ID de la liste de la carte
                destList.cards.splice(destination.index, 0, movedCard); // Ajoute la carte à la liste destination

                // Met à jour l'ordre des cartes dans les deux listes
                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                destList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                setOrderedData(newOrderedData); // Met à jour l'état avec les cartes réorganisées entre les listes
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destList.cards
                })
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        className="flex gap-x-3 h-full"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {orderedData.map((list, index) => {
                            return (
                                <ListItem
                                    key={list.id}
                                    index={index}
                                    data={list}
                                />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}
import { CollisionPriority } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/react/sortable";
import type { ReactNode } from "react";
import { type Element, ElementItem } from "@/entities/element";

type SortableNiveauProps = {
    element: Element;
    index: number;
    children: ReactNode;
    onEdit?: (element: Element) => void;
    onDelete?: (element: Element) => void;
};

export function SortableNiveau({
    element,
    index,
    children,
    onEdit,
    onDelete,
}: SortableNiveauProps) {
    const { ref } = useSortable({
        id: element.id,
        index,
        type: "niveau",
        accept: ["espace", "niveau"],
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <div ref={ref}>
            <ElementItem
                element={element}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            <div className="pl-6">{children}</div>
        </div>
    );
}

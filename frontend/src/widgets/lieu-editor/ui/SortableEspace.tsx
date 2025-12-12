import { useSortable } from "@dnd-kit/react/sortable";
import { type Element, ElementItem } from "@/entities/element";

type SortableEspaceProps = {
    element: Element;
    index: number;
    niveauId: string;
    onRename?: (element: Element, newName: string) => void;
    onDelete?: (element: Element) => void;
};

export function SortableEspace({
    element,
    index,
    niveauId,
    onRename,
    onDelete,
}: SortableEspaceProps) {
    const { ref, isDragging } = useSortable({
        id: element.id,
        index,
        type: "espace",
        accept: "espace",
        group: niveauId,
    });

    return (
        <div
            ref={ref}
            style={{
                opacity: isDragging ? 0.4 : 1,
            }}
        >
            <ElementItem
                element={element}
                onRename={onRename}
                onDelete={onDelete}
            />
        </div>
    );
}

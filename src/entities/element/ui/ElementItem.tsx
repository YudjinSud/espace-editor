import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Element, ElementType } from "../model/types";
import {
    containerVariants,
    dragHandleVariants,
    editButtonVariants,
    textVariants,
} from "./styles";

type ElementItemProps = {
    element: Element;
    onEdit?: (element: Element) => void;
    onDelete?: (element: Element) => void;
    dragHandleRef?: React.Ref<HTMLButtonElement>;
};

export function ElementItem({
    element,
    onEdit,
    onDelete,
    dragHandleRef,
}: ElementItemProps) {
    const type = element.type as ElementType;

    return (
        <div className={containerVariants({ type })}>
            <div className="flex items-center gap-1">
                <Button
                    ref={dragHandleRef}
                    variant="ghost"
                    size="icon"
                    className={dragHandleVariants({ type })}
                >
                    <GripVertical className="w-5 h-5" />
                </Button>
                <span className={textVariants({ type })}>{element.name}</span>
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(element)}
                    className={editButtonVariants({ type })}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(element)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

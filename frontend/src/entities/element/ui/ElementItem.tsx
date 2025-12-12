import { Check, GripVertical, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Element, ElementType } from "../model/types";
import {
    containerVariants,
    dragHandleVariants,
    editButtonVariants,
    inputVariants,
    textVariants,
} from "./styles";

type ElementItemProps = {
    element: Element;
    onRename?: (element: Element, newName: string) => void;
    onDelete?: (element: Element) => void;
    dragHandleRef?: React.Ref<HTMLButtonElement>;
};

export function ElementItem({
    element,
    onRename,
    onDelete,
    dragHandleRef,
}: ElementItemProps) {
    const type = element.type as ElementType;
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(element.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleStartEdit = () => {
        setEditValue(element.name);
        setIsEditing(true);
    };

    const handleConfirm = () => {
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== element.name) {
            onRename?.(element, trimmed);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(element.name);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleConfirm();
        if (e.key === "Escape") handleCancel();
    };

    const renderDragHandle = () => (
        <Button
            ref={dragHandleRef}
            variant="ghost"
            size="icon"
            className={dragHandleVariants({ type })}
        >
            <GripVertical className="w-5 h-5" />
        </Button>
    );

    const renderEditInput = () => (
        <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputVariants({ type })}
        />
    );

    const renderDisplayText = () => (
        <span className={textVariants({ type })}>{element.name}</span>
    );

    const renderEditingActions = () => (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleConfirm}
                className="text-green-500 hover:text-green-700 hover:bg-green-50"
            >
                <Check className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
                <X className="w-4 h-4" />
            </Button>
        </>
    );

    const renderDefaultActions = () => (
        <>
            {onRename && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStartEdit}
                    className={editButtonVariants({ type })}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(element)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </>
    );

    return (
        <div className={containerVariants({ type })}>
            <div className="flex items-center gap-1 flex-1 min-w-0">
                {renderDragHandle()}
                {isEditing ? renderEditInput() : renderDisplayText()}
            </div>
            <div className="flex items-center gap-1">
                {isEditing ? renderEditingActions() : renderDefaultActions()}
            </div>
        </div>
    );
}

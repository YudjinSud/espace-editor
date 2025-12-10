import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    headerButtonVariants,
    headerTitleVariants,
    headerVariants,
} from "./styles";

type LieuEditorHeaderProps = {
    title: string;
    onClose?: () => void;
};

export function LieuEditorHeader({ title, onClose }: LieuEditorHeaderProps) {
    return (
        <div className={headerVariants()}>
            <h1 className={headerTitleVariants()}>{title}</h1>
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={headerButtonVariants()}
            >
                <X className="w-5 h-5" />
            </Button>
        </div>
    );
}

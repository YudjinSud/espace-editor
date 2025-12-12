import { Separator } from "@/components/ui/separator";
import type { Element } from "@/entities/element";
import { SortableEspace } from "./SortableEspace";

type EspacesListProps = {
    espaceIds: string[];
    niveauId: string;
    getElementById: (id: string) => Element | undefined;
    onRename: (element: Element, newName: string) => void;
    onDelete: (element: Element) => void;
};

export function EspacesList({
    espaceIds,
    niveauId,
    getElementById,
    onRename,
    onDelete,
}: EspacesListProps) {
    if (espaceIds.length === 0) {
        return (
            <div className="h-12 flex items-center justify-center text-slate-400 text-sm -ml-6">
                Aucun espace
            </div>
        );
    }

    return espaceIds.map((espaceId, index) => {
        const espace = getElementById(espaceId);
        if (!espace) return null;

        return (
            <div key={espaceId}>
                <SortableEspace
                    element={espace}
                    index={index}
                    niveauId={niveauId}
                    onRename={onRename}
                    onDelete={onDelete}
                />
                {index < espaceIds.length - 1 && <Separator />}
            </div>
        );
    });
}

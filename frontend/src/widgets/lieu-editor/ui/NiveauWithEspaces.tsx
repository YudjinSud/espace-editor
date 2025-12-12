import type { Element } from "@/entities/element";
import { ORPHAN_NIVEAU_ID } from "../lib/useLieuEditor";
import { EspacesList } from "./EspacesList";
import { SortableNiveau } from "./SortableNiveau";

type NiveauWithEspacesProps = {
    niveauId: string;
    index: number;
    espaceIds: string[];
    getElementById: (id: string) => Element | undefined;
    onRename: (element: Element, newName: string) => void;
    onDelete: (element: Element) => void;
};

export function NiveauWithEspaces({
    niveauId,
    index,
    espaceIds,
    getElementById,
    onRename,
    onDelete,
}: NiveauWithEspacesProps) {
    const niveau = getElementById(niveauId);
    if (!niveau) return null;

    const isOrphan = niveauId === ORPHAN_NIVEAU_ID;

    return (
        <SortableNiveau
            element={niveau}
            index={index}
            onRename={isOrphan ? undefined : onRename}
            onDelete={isOrphan ? undefined : onDelete}
        >
            <EspacesList
                espaceIds={espaceIds}
                niveauId={niveauId}
                getElementById={getElementById}
                onRename={onRename}
                onDelete={onDelete}
            />
        </SortableNiveau>
    );
}

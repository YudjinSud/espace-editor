import { move } from "@dnd-kit/helpers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { type Element, useElementsStore } from "@/entities/element";

export const ORPHAN_NIVEAU_ID = "__espaces_annexes__";

export function useLieuEditor() {
    const useStore = useElementsStore();
    const elements = useStore((s) => s.elements);
    const fetchElements = useStore((s) => s.fetchElements);
    const updateElement = useStore((s) => s.updateElement);
    const deleteElement = useStore((s) => s.deleteElement);
    const syncOrder = useStore((s) => s.syncOrder);

    useEffect(() => {
        fetchElements();
    }, [fetchElements]);

    const { niveaux, espaces } = useMemo(() => {
        const niveaux: Element[] = [];
        const espaces: Element[] = [];
        for (const el of elements) {
            if (el.type === "niveau") niveaux.push(el);
            else espaces.push(el);
        }
        niveaux.sort((a, b) => a.order - b.order);
        espaces.sort((a, b) => a.order - b.order);
        return { niveaux, espaces };
    }, [elements]);

    const [niveauOrder, setNiveauOrder] = useState<string[]>([]);
    const [espacesByNiveau, setEspacesByNiveau] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const niveauIds = new Set(niveaux.map((n) => n.id));

        const byNiveau: Record<string, string[]> = Object.fromEntries(
            niveaux.map((n) => [n.id, [] as string[]])
        );
        byNiveau[ORPHAN_NIVEAU_ID] = [];

        for (const espace of espaces) {
            const parentId = espace.parentId && niveauIds.has(espace.parentId)
                ? espace.parentId
                : ORPHAN_NIVEAU_ID;
            byNiveau[parentId].push(espace.id);
        }

        const order = niveaux.map((n) => n.id);
        if (byNiveau[ORPHAN_NIVEAU_ID].length > 0) {
            order.push(ORPHAN_NIVEAU_ID);
        } else {
            delete byNiveau[ORPHAN_NIVEAU_ID];
        }

        setNiveauOrder(order);
        setEspacesByNiveau(byNiveau);
    }, [niveaux, espaces]);

    const orphanNiveau: Element = {
        id: ORPHAN_NIVEAU_ID,
        name: "Espaces Annexes",
        type: "niveau",
        order: niveaux.length,
    };

    const getElementById = (id: string): Element | undefined => {
        if (id === ORPHAN_NIVEAU_ID) return orphanNiveau;
        return elements.find((el) => el.id === id);
    };

    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const showToast = useCallback((message: string, delay = 500) => {
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
            toast.success(message);
        }, delay);
    }, []);

    const handleRename = (element: Element, newName: string) => {
        updateElement(element.id, { name: newName });
        showToast("Nom modifié");
    };

    const handleDelete = (element: Element) => {
        deleteElement(element.id);
        showToast("Élément supprimé");
    };

    const handleClose = () => {
        console.log("Close");
    };

    const previousEspaces = useRef(espacesByNiveau);

    // biome-ignore lint/suspicious/noExplicitAny: dnd-kit types
    const handleDragStart = () => {
        previousEspaces.current = espacesByNiveau;
    };

    // biome-ignore lint/suspicious/noExplicitAny: dnd-kit types
    const handleDragOver = (event: any) => {
        const { source } = event.operation;
        if (source?.type === "niveau") return;
        setEspacesByNiveau((items) => move(items, event));
    };

    // biome-ignore lint/suspicious/noExplicitAny: dnd-kit types
    const handleDragEnd = (event: any) => {
        const { source } = event.operation;

        if (event.canceled) {
            if (source?.type === "espace") {
                setEspacesByNiveau(previousEspaces.current);
            }
            return;
        }

        if (source?.type === "niveau") {
            const newOrder = move(niveauOrder, event);
            setNiveauOrder(newOrder);
            syncOrder(espacesByNiveau, newOrder, ORPHAN_NIVEAU_ID);
        } else {
            syncOrder(espacesByNiveau, niveauOrder, ORPHAN_NIVEAU_ID);
        }
        showToast("Ordre modifié");
    };

    return {
        niveauOrder,
        espacesByNiveau,
        getElementById,
        handleRename,
        handleDelete,
        handleClose,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}

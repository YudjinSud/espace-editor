import { useEffect, useMemo, useState } from "react";
import { type Element, useElementsStore } from "@/entities/element";

export function useLieuEditor() {
    const useStore = useElementsStore();
    const elements = useStore((s) => s.elements);
    const fetchElements = useStore((s) => s.fetchElements);
    const deleteElement = useStore((s) => s.deleteElement);
    const syncOrder = useStore((s) => s.syncOrder);

    useEffect(() => {
        fetchElements();
    }, [fetchElements]);

    const niveaux = useMemo(
        () =>
            elements
                .filter((el) => el.type === "niveau")
                .sort((a, b) => a.order - b.order),
        [elements],
    );

    const [niveauOrder, setNiveauOrder] = useState<string[]>([]);

    const [espacesByNiveau, setEspacesByNiveau] = useState<
        Record<string, string[]>
    >({});

    useEffect(() => {
        const order = niveaux.map((n) => n.id);
        setNiveauOrder(order);

        const byNiveau: Record<string, string[]> = {};
        for (const niveau of niveaux) {
            byNiveau[niveau.id] = elements
                .filter(
                    (el) => el.type === "espace" && el.parentId === niveau.id,
                )
                .sort((a, b) => a.order - b.order)
                .map((el) => el.id);
        }
        setEspacesByNiveau(byNiveau);
    }, [elements, niveaux]);

    const getElementById = (id: string): Element | undefined => {
        return elements.find((el) => el.id === id);
    };

    const handleEdit = (element: Element) => {
        console.log("Edit:", element);
    };

    const handleDelete = (element: Element) => {
        deleteElement(element.id);
    };

    const handleClose = () => {
        console.log("Close");
    };

    return {
        niveauOrder,
        setNiveauOrder,
        espacesByNiveau,
        setEspacesByNiveau,
        syncOrder,
        getElementById,
        handleEdit,
        handleDelete,
        handleClose,
    };
}

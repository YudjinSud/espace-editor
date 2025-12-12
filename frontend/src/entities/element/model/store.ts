import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Element } from "./types";

export type ElementsStore = {
    elements: Element[];
    fetchElements: () => Promise<void>;
    addElement: (element: Omit<Element, "id">) => Promise<void>;
    updateElement: (id: string, updates: Partial<Element>) => Promise<void>;
    deleteElement: (id: string) => Promise<void>;
    syncOrder: (
        espacesByNiveau: Record<string, string[]>,
        niveauOrder: string[],
        orphanGroupId?: string,
    ) => Promise<void>;
};

export type ElementsApi = {
    getElements: () => Promise<Element[]>;
    createElement: (element: Omit<Element, "id">) => Promise<Element>;
    updateElement: (id: string, updates: Partial<Element>) => Promise<Element>;
    deleteElement: (id: string) => Promise<void>;
};

export const createElementsStore = (api: ElementsApi) => {
    return create<ElementsStore>()(
        devtools(
            (set, get) => ({
                elements: [],

                fetchElements: async () => {
                    const elements = await api.getElements();
                    set({ elements }, false, "fetchElements");
                },

                addElement: async (element) => {
                    await api.createElement(element);
                    const elements = await api.getElements();
                    set({ elements }, false, "addElement");
                },

                updateElement: async (id, updates) => {
                    await api.updateElement(id, updates);
                    const elements = await api.getElements();
                    set({ elements }, false, "updateElement");
                },

                deleteElement: async (id) => {
                    await api.deleteElement(id);
                    const elements = await api.getElements();
                    set({ elements }, false, "deleteElement");
                },

                syncOrder: async (espacesByNiveau, niveauOrder, orphanGroupId?: string) => {
                    const { elements } = get();
                    const updates: Promise<Element>[] = [];

                    for (let i = 0; i < niveauOrder.length; i++) {
                        const niveauId = niveauOrder[i];
                        const niveau = elements.find(
                            (el) => el.id === niveauId,
                        );
                        if (niveau && niveau.order !== i) {
                            updates.push(
                                api.updateElement(niveauId, { order: i }),
                            );
                        }
                    }

                    for (const [niveauId, espaceIds] of Object.entries(
                        espacesByNiveau,
                    )) {
                        const isOrphanGroup = orphanGroupId && niveauId === orphanGroupId;

                        for (let i = 0; i < espaceIds.length; i++) {
                            const espaceId = espaceIds[i];
                            const espace = elements.find(
                                (el) => el.id === espaceId,
                            );
                            if (espace) {
                                const targetParentId = isOrphanGroup ? undefined : niveauId;
                                const needsUpdate =
                                    espace.order !== i ||
                                    espace.parentId !== targetParentId;
                                if (needsUpdate) {
                                    updates.push(
                                        api.updateElement(espaceId, {
                                            order: i,
                                            parentId: targetParentId,
                                        }),
                                    );
                                }
                            }
                        }
                    }

                    if (updates.length > 0) {
                        await Promise.all(updates);
                        const newElements = await api.getElements();
                        set({ elements: newElements }, false, "syncOrder");
                    }
                },
            }),
            { name: "ElementsStore" },
        ),
    );
};

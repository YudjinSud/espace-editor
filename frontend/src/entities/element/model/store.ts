import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Element } from "./types";

export type ElementsStore = {
    elements: Element[];
    isLoading: boolean;
    fetchElements: () => Promise<void>;
    seedInitialData: () => Promise<void>;
    addElement: (element: Omit<Element, "id">) => Promise<void>;
    updateElement: (id: string, updates: Partial<Element>) => Promise<void>;
    deleteElement: (id: string) => Promise<void>;
    syncOrder: (
        espacesByNiveau: Record<string, string[]>,
        niveauOrder: string[],
        orphanGroupId?: string,
    ) => Promise<void>;
};

type InitialElement = {
    tempId: string;
    name: string;
    type: "niveau" | "espace";
    parentTempId?: string;
    order: number;
};

const INITIAL_ELEMENTS: InitialElement[] = [
    // Rez-de-chaussée
    { tempId: "n001", name: "Rez-de-chaussée", type: "niveau", order: 0 },
    { tempId: "e001", name: "Entrée", type: "espace", parentTempId: "n001", order: 0 },
    { tempId: "e002", name: "Salon", type: "espace", parentTempId: "n001", order: 1 },
    { tempId: "e003", name: "Cuisine", type: "espace", parentTempId: "n001", order: 2 },
    { tempId: "e004", name: "WC", type: "espace", parentTempId: "n001", order: 3 },
    // 1er étage
    { tempId: "n002", name: "1er étage", type: "niveau", order: 1 },
    { tempId: "e005", name: "Chambre 1", type: "espace", parentTempId: "n002", order: 0 },
    { tempId: "e006", name: "Chambre 2", type: "espace", parentTempId: "n002", order: 1 },
    { tempId: "e007", name: "Salle de bain", type: "espace", parentTempId: "n002", order: 2 },
];

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
                isLoading: false,

                fetchElements: async () => {
                    set({ isLoading: true }, false, "fetchElements/start");
                    const elements = await api.getElements();
                    set({ elements, isLoading: false }, false, "fetchElements");

                    // Pre-fill with initial data if lieu is empty
                    if (elements.length === 0) {
                        await get().seedInitialData();
                    }
                },

                seedInitialData: async () => {
                    const tempIdToRealId: Record<string, string> = {};

                    // First, create all niveaux to get their real IDs
                    const niveaux = INITIAL_ELEMENTS.filter(el => el.type === "niveau");
                    for (const niveau of niveaux) {
                        const created = await api.createElement({
                            name: niveau.name,
                            type: niveau.type,
                            order: niveau.order,
                        });
                        tempIdToRealId[niveau.tempId] = created.id;
                    }

                    // Then create all espaces with correct parentId
                    const espaces = INITIAL_ELEMENTS.filter(el => el.type === "espace");
                    for (const espace of espaces) {
                        await api.createElement({
                            name: espace.name,
                            type: espace.type,
                            order: espace.order,
                            parentId: espace.parentTempId ? tempIdToRealId[espace.parentTempId] : undefined,
                        });
                    }

                    // Refresh elements
                    const elements = await api.getElements();
                    set({ elements }, false, "seedInitialData");
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

import type { ElementsApi } from "./store";
import type { Element } from "./types";

const generateId = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return Array.from(
        { length: 4 },
        () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
};

let elements: Element[] = [
    // Rez-de-chaussée
    { id: "n001", name: "Rez-de-chaussée", type: "niveau", order: 0 },
    { id: "e001", name: "Entrée", type: "espace", parentId: "n001", order: 0 },
    { id: "e002", name: "Salon", type: "espace", parentId: "n001", order: 1 },
    { id: "e003", name: "WC", type: "espace", parentId: "n001", order: 2 },

    // 1er étage
    { id: "n002", name: "1er étage", type: "niveau", order: 1 },
    {
        id: "e004",
        name: "Chambre 1",
        type: "espace",
        parentId: "n002",
        order: 0,
    },
    {
        id: "e005",
        name: "Chambre 2",
        type: "espace",
        parentId: "n002",
        order: 1,
    },

    // 2e étage
    { id: "n003", name: "2e étage", type: "niveau", order: 2 },
    {
        id: "e006",
        name: "Chambre 3",
        type: "espace",
        parentId: "n003",
        order: 0,
    },
    {
        id: "e007",
        name: "Chambre 4",
        type: "espace",
        parentId: "n003",
        order: 1,
    },

    { id: "e008", name: "Cave", type: "espace", order: 0 },
    { id: "e009", name: "Garage", type: "espace", parentId: "deleted-niveau", order: 1 },

];

export const mockElementsApi: ElementsApi = {
    getElements: async () => {
        return [...elements];
    },

    createElement: async (element) => {
        const newElement: Element = {
            ...element,
            id: generateId(),
        };
        elements = [...elements, newElement];
        return newElement;
    },

    updateElement: async (id, updates) => {
        const index = elements.findIndex((el) => el.id === id);
        if (index === -1) throw new Error(`Element ${id} not found`);

        const updated = { ...elements[index], ...updates };
        elements = elements.map((el) => (el.id === id ? updated : el));
        return updated;
    },

    deleteElement: async (id) => {
        elements = elements.filter((el) => el.id !== id);
    },
};

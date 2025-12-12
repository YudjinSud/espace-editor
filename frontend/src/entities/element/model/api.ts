import {
    elementControllerCreate,
    elementControllerFindAll,
    elementControllerRemove,
    elementControllerUpdate,
} from "@/shared/api/generated/elements/elements";
import type { UpdateElementDtoParentId } from "@/shared/api/generated/model";
import type { ElementsApi } from "./store";
import type { Element } from "./types";

export const createElementsApi = (lieuId: string): ElementsApi => ({
    getElements: async () => {
        const data = await elementControllerFindAll(lieuId);
        return data as unknown as Element[];
    },

    createElement: async (element) => {
        const data = await elementControllerCreate(lieuId, {
            name: element.name,
            type: element.type,
            parentId: element.parentId,
            order: element.order,
        });
        return data as unknown as Element;
    },

    updateElement: async (id, updates) => {
        const data = await elementControllerUpdate(lieuId, id, {
            name: updates.name,
            parentId: updates.parentId! as unknown as UpdateElementDtoParentId,
            order: updates.order,
        });
        return data as unknown as Element;
    },

    deleteElement: async (id) => {
        await elementControllerRemove(lieuId, id);
    },
});

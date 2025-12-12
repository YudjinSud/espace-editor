import { type ReactNode, useRef } from "react";
import {
    createElementsApi,
    createElementsStore,
    ElementsStoreContext,
    type ElementsStore,
} from "@/entities/element";
import type { StoreApi } from "zustand";

type ElementsProviderProps = {
    lieuId: string;
    children: ReactNode;
};

export function ElementsProvider({ lieuId, children }: ElementsProviderProps) {
    const storeRef = useRef<StoreApi<ElementsStore> | null>(null);

    if (!storeRef.current) {
        const api = createElementsApi(lieuId);
        storeRef.current = createElementsStore(api);
    }

    return (
        <ElementsStoreContext.Provider value={storeRef.current}>
            {children}
        </ElementsStoreContext.Provider>
    );
}

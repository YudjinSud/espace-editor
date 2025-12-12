import { createContext, useContext } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import type { ElementsStore } from "./store";

export const ElementsStoreContext = createContext<UseBoundStore<
    StoreApi<ElementsStore>
> | null>(null);

export const useElementsStore = () => {
    const store = useContext(ElementsStoreContext);
    if (store === null) {
        throw new Error(
            "useElementsStore must be used within ElementsStoreContext.Provider",
        );
    }
    return store;
};

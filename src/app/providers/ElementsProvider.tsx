import type { ReactNode } from "react";
import {
    createElementsStore,
    ElementsStoreContext,
    mockElementsApi,
} from "@/entities/element";

const elementsStore = createElementsStore(mockElementsApi);

type ElementsProviderProps = {
    children: ReactNode;
};

export function ElementsProvider({ children }: ElementsProviderProps) {
    return (
        <ElementsStoreContext.Provider value={elementsStore}>
            {children}
        </ElementsStoreContext.Provider>
    );
}

'use client';

import { createContext, useContext } from "react";
export const CollectionContext = createContext<any | undefined>(undefined);
export function useCollection() {
    const context = useContext(CollectionContext);
    if (context === undefined) {
        throw new Error("useCollection must be used within a CollectionProvider");
    }
    return context;
}

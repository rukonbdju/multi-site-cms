'use client';

import { Provider } from "react-redux";

import { useRef } from "react";
import type { EnhancedStore } from "@reduxjs/toolkit";
import { store } from ".";

interface StoreProviderProps {
    children: React.ReactNode;
}


const StoreProvider = ({ children }: StoreProviderProps) => {
    const storeRef = useRef<EnhancedStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = store;
    }

    return <Provider store={storeRef.current}> {children} </Provider>;
};

export default StoreProvider;


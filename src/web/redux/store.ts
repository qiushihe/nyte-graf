import { configureStore } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
import { Middleware } from "@reduxjs/toolkit";
import { StoreEnhancer } from "@reduxjs/toolkit";

import { getDevToolOptions } from "./dev-tool";
import { clickMarkerMiddleware } from "./middleware/click-marker";
import { clickedOnMiddleware } from "./middleware/clicked-on";
import { rootReducer } from "./reducer";
import { RootState } from "./store.type";

export const createStore = (initialState?: Partial<RootState>) => {
  return configureStore<RootState, AnyAction, Middleware[], StoreEnhancer[]>({
    preloadedState: initialState,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      clickMarkerMiddleware,
      clickedOnMiddleware
    ],
    devTools: getDevToolOptions(process.env.NODE_ENV !== "production")
  });
};

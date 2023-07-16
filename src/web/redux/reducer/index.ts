import { combineReducers } from "@reduxjs/toolkit";

import { RootState } from "../store.type";
import { backgroundColorReducer } from "./background-color";
import { mousePositionReducer } from "./mouse-position";
import { shapesReducer } from "./shapes";

export const rootReducer = combineReducers<RootState>({
  backgroundColor: backgroundColorReducer,
  mousePosition: mousePositionReducer,
  shapes: shapesReducer
});

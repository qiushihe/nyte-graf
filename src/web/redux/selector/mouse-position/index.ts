import get from "lodash/fp/get";
import { createSelector } from "reselect";

import { RootState } from "../../store.type";
import { mousePosition } from "../root";

export const positionX: (state: RootState) => number = createSelector(mousePosition, get("x"));

export const positionY: (state: RootState) => number = createSelector(mousePosition, get("y"));

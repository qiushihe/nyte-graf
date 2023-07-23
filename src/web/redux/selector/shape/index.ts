import { createSelector } from "reselect";

import { RootState, Shape } from "../../store.type";
import { shapes as allShapes } from "../root";

export const shape: (state: RootState, id: string) => Shape | null = createSelector(
  [(_, id: string) => id, allShapes],
  (id, shapes) => {
    return shapes.find((shape) => shape.id === id) || null;
  }
);

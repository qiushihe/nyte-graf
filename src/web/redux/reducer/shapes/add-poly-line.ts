import { ReducerMapValue } from "redux-actions";

import { AddPolyLinePayload } from "../../action/shapes.type";
import { PolyLine, RootState, ShapeInstance } from "../../store.type";

export const addPolyLine: ReducerMapValue<RootState["shapes"], AddPolyLinePayload> = (
  state,
  action
) => {
  const shape: PolyLine = {
    type: "poly-line",
    points: action.payload.points.map(([posX, posY]) => ({ posX, posY }))
  };

  const shapeInstance: ShapeInstance<PolyLine> = {
    id: action.payload.id,
    layerId: null,
    ...shape
  };

  return [...state, shapeInstance];
};

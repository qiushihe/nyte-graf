import { ReducerMapValue } from "redux-actions";

import { AddCirclePayload } from "../../action/shapes.type";
import { Circle, RootState, ShapeInstance } from "../../store.type";

export const addCircle: ReducerMapValue<RootState["shapes"], AddCirclePayload> = (
  state,
  action
) => {
  const shape: Circle = {
    type: "circle",
    posX: action.payload.posX,
    posY: action.payload.posY,
    radius: action.payload.radius
  };

  const shapeInstance: ShapeInstance<Circle> = {
    id: action.payload.id,
    layerId: null,
    ...shape
  };

  return [...state, shapeInstance];
};

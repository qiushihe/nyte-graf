import { ReducerMapValue } from "redux-actions";

import { AddRectanglePayload } from "../../action/shapes.type";
import { Rectangle, RootState, ShapeInstance } from "../../store.type";

export const addRectangle: ReducerMapValue<RootState["shapes"], AddRectanglePayload> = (
  state,
  action
) => {
  const shape: Rectangle = {
    type: "rectangle",
    posX: action.payload.posX,
    posY: action.payload.posY,
    width: action.payload.width,
    height: action.payload.height
  };

  const shapeInstance: ShapeInstance<Rectangle> = {
    id: action.payload.id,
    layerId: null,
    ...shape
  };

  return [...state, shapeInstance];
};

import { ReducerMapValue } from "redux-actions";

import { UpdateShapeStylePayload } from "../../action/shapes.type";
import { RootState } from "../../store.type";

export const updateShapeStyle: ReducerMapValue<RootState["shapes"], UpdateShapeStylePayload> = (
  state,
  action
) => {
  const shape = state.find((shape) => shape.id === action.payload.id) || null;
  if (!shape) {
    return state;
  } else {
    return [
      ...state.filter((shape) => shape.id !== action.payload.id),
      { ...shape, ...action.payload.style }
    ];
  }
};

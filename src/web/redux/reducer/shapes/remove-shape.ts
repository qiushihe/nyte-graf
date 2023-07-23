import { ReducerMapValue } from "redux-actions";

import { RemoveShapePayload } from "../../action/shapes.type";
import { RootState } from "../../store.type";

export const removeShape: ReducerMapValue<RootState["shapes"], RemoveShapePayload> = (
  state,
  action
) => {
  if (!action.payload.id) {
    return state;
  } else {
    return state.filter((shape) => shape.id !== action.payload.id);
  }
};

import { ReducerMapValue } from "redux-actions";

import { MouseMovePayload } from "../../action/mouse-position.type";
import { RootState } from "../../store.type";

export const mouseMove: ReducerMapValue<RootState["mousePosition"], MouseMovePayload> = (
  state,
  action
) => {
  return { x: action.payload.x, y: action.payload.y };
};

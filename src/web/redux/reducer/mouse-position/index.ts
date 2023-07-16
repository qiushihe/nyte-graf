import { handleActions } from "redux-actions";

import { MOUSE_MOVE } from "../../action/mouse-position";
import { RootState } from "../../store.type";
import { mouseMove } from "./mouse-move";

export const mousePositionReducer = handleActions<RootState["mousePosition"], unknown>(
  {
    [MOUSE_MOVE]: mouseMove
  },
  { x: -1, y: -1 }
);

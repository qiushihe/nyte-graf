import { handleActions } from "redux-actions";

import { SET_COLOR } from "../../action/background-color";
import { RESET_COLOR } from "../../action/background-color";
import { RootState } from "../../store.type";
import { resetColor } from "./reset-color";
import { setColor } from "./set-color";

export const backgroundColorReducer = handleActions<RootState["backgroundColor"], unknown>(
  {
    [SET_COLOR]: setColor,
    [RESET_COLOR]: resetColor
  },
  "#ffffff"
);

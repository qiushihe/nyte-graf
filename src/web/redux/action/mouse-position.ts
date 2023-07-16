import { createAction } from "@reduxjs/toolkit";

import { ActionPreparer } from "./action.type";
import { MouseMovePayload } from "./mouse-position.type";

export const MOUSE_MOVE = "MOUSE_POSITION/MOUSE_MOVE";

export const mouseMove = createAction<ActionPreparer<[number, number], MouseMovePayload>>(
  MOUSE_MOVE,
  (x, y) => {
    return {
      payload: { x, y }
    };
  }
);

export const MOUSE_CLICK = "MOUSE_POSITION/MOUSE_CLICK";

export const mouseClick = createAction(MOUSE_CLICK);

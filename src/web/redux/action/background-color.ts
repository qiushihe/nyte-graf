import { createAction } from "@reduxjs/toolkit";

import { ActionPreparer } from "./action.type";
import { SetColorPayload } from "./background-color.type";

export const SET_COLOR = "BACKGROUND_COLOR/SET_COLOR";

export const setColor = createAction<ActionPreparer<[string], SetColorPayload>>(
  SET_COLOR,
  (color) => {
    return {
      payload: { color }
    };
  }
);

export const RESET_COLOR = "BACKGROUND_COLOR/RESET_COLOR";

export const resetColor = createAction(RESET_COLOR);

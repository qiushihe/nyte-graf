import { MouseMovePayload } from "~nyte-graf-web/canvas-state/action/mouse-move";
import { CanvasState } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { StateMachineReducer } from "~nyte-graf-web/state-machine/state-machine.type";

const handleMouseMove: StateMachineReducer<CanvasState, MouseMovePayload> = {
  types: ["mouse-move"],
  apply: (state, action) => {
    return {
      ...state,
      mousePosition: { x: action.payload.x, y: action.payload.y }
    };
  }
};

export const mousePositionReducers = [handleMouseMove];

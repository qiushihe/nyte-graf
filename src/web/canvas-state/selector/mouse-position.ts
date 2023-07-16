import { CanvasState } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { StateMachineSelector } from "~nyte-graf-web/state-machine/state-machine.type";

export const mousePositionX: StateMachineSelector<CanvasState, number> = (state) => {
  return state.mousePosition.x;
};

export const mousePositionY: StateMachineSelector<CanvasState, number> = (state) => {
  return state.mousePosition.y;
};

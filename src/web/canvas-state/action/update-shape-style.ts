import { ShapeStyle } from "~nyte-graf-web/canvas-state/canvas-state.type";
import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type UpdateShapeStylePayload = { id: string; style: ShapeStyle };

export const updateShapeStyle = (
  id: string,
  style: ShapeStyle
): StateMachineAction<UpdateShapeStylePayload> => {
  return {
    type: "update-shape-style",
    payload: { id, style }
  };
};

import { Coordinate } from "~nyte-graf-web/polygon/polygon.type";
import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type AddPolyLinePayload = {
  id: string;
  points: Coordinate[];
};

export const addPolyLine = (
  id: string,
  points: Coordinate[]
): StateMachineAction<AddPolyLinePayload> => {
  return {
    type: "add-poly-line",
    payload: { id, points }
  };
};

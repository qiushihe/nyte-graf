import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type AddRectanglePayload = {
  id: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
};

export const addRectangle = (
  id: string,
  posX: number,
  posY: number,
  width: number,
  height: number
): StateMachineAction<AddRectanglePayload> => {
  return {
    type: "add-rectangle",
    payload: { id, posX, posY, width, height }
  };
};

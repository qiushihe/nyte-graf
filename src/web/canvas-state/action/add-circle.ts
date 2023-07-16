import { StateMachineAction } from "~nyte-graf-web/state-machine/state-machine.type";

export type AddCirclePayload = {
  id: string;
  posX: number;
  posY: number;
  radius: number;
};

export const addCircle = (
  id: string,
  posX: number,
  posY: number,
  radius: number
): StateMachineAction<AddCirclePayload> => {
  return {
    type: "add-circle",
    payload: { id, posX, posY, radius }
  };
};

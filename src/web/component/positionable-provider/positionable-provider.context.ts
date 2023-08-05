import { createContext, useContext } from "react";

export type MoveStart = (id: string) => void;

export type MoveEnd = (id: string) => void;

export type IsMoving = (id: string) => boolean;

export type GetPosition = (id: string) => { x: number; y: number };

export type SetPosition = (id: string, x: number, y: number) => void;

export type PositionableContext = {
  moveStart: MoveStart;
  moveEnd: MoveEnd;
  isMoving: IsMoving;
  getPosition: GetPosition;
  setPosition: SetPosition;
};

export const positionableContext = createContext<PositionableContext>({
  moveStart: () => {},
  moveEnd: () => {},
  isMoving: () => false,
  getPosition: () => ({ x: 0, y: 0 }),
  setPosition: () => {}
});

export const usePositionable = (): PositionableContext => {
  return useContext(positionableContext);
};

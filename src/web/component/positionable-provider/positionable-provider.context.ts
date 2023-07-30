import { createContext, useContext } from "react";

export type DragStart = (id: string) => void;

export type DragEnd = (id: string) => void;

export type IsDragging = (id: string) => boolean;

export type GetPosition = (id: string) => { x: number; y: number };

export type SetPosition = (id: string, x: number, y: number) => void;

export type PositionableContext = {
  dragStart: DragStart;
  dragEnd: DragEnd;
  isDragging: IsDragging;
  getPosition: GetPosition;
  setPosition: SetPosition;
};

export const positionableContext = createContext<PositionableContext>({
  dragStart: () => {},
  dragEnd: () => {},
  isDragging: () => false,
  getPosition: () => ({ x: 0, y: 0 }),
  setPosition: () => {}
});

export const usePositionable = (): PositionableContext => {
  return useContext(positionableContext);
};

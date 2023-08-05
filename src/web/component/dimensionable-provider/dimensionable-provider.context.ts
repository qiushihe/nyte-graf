import { createContext, useContext } from "react";

export type ResizeStart = (id: string) => void;

export type ResizeEnd = (id: string) => void;

export type IsResizing = (id: string) => boolean;

export type SetDimension = (id: string, width: number, height: number) => void;

export type GetDimension = (id: string) => { width: number; height: number };

export type DimensionableContext = {
  resizeStart: ResizeStart;
  resizeEnd: ResizeEnd;
  isResizing: IsResizing;
  setDimension: SetDimension;
  getDimension: GetDimension;
};

export const dimensionableContext = createContext<DimensionableContext>({
  resizeStart: () => {},
  resizeEnd: () => {},
  isResizing: () => false,
  setDimension: () => {},
  getDimension: () => ({ width: 0, height: 0 })
});

export const useDimensionable = (): DimensionableContext => {
  return useContext(dimensionableContext);
};

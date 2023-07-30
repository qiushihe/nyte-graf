import { createContext, useContext } from "react";

export type SetDimension = (id: string, width: number, height: number) => void;

export type GetDimension = (id: string) => { width: number; height: number };

export type DimensionableContext = {
  setDimension: SetDimension;
  getDimension: GetDimension;
};

export const dimensionableContext = createContext<DimensionableContext>({
  setDimension: () => {},
  getDimension: () => ({ width: 0, height: 0 })
});

export const useDimensionable = (): DimensionableContext => {
  return useContext(dimensionableContext);
};

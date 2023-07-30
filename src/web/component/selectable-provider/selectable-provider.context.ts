import { createContext, useContext } from "react";

export type Select = (id: string) => void;

export type Deselect = (id: string) => void;

export type DeselectAll = () => void;

export type IsSelected = (id: string) => boolean;

export type SelectableContext = {
  select: Select;
  deselect: Deselect;
  deselectAll: DeselectAll;
  isSelected: IsSelected;
};

export const selectableContext = createContext<SelectableContext>({
  select: () => {},
  deselect: () => {},
  deselectAll: () => {},
  isSelected: () => false
});

export const useSelectable = (): SelectableContext => {
  return useContext(selectableContext);
};

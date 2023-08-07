import difference from "lodash/fp/difference";
import includes from "lodash/fp/includes";
import React, { useState } from "react";

import { uniqueOrderedStrings } from "~nyte-graf-core/util/array";

import { selectableContext } from "./selectable-provider.context";
import { Select } from "./selectable-provider.context";
import { Deselect } from "./selectable-provider.context";
import { DeselectAll } from "./selectable-provider.context";
import { IsSelected } from "./selectable-provider.context";
import { SelectableProviderProps } from "./selectable-provider.type";

export const SelectableProvider: React.FC<SelectableProviderProps> = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect: Select = (id) => {
    setSelectedIds((state) => {
      return uniqueOrderedStrings([...state, id]);
    });
  };

  const handleDeselect: Deselect = (id) => {
    setSelectedIds((state) => {
      return difference(state)([id]);
    });
  };

  const handleDeselectAll: DeselectAll = () => {
    setSelectedIds(() => []);
  };

  const handleIsSelected: IsSelected = (id) => {
    return includes(id)(selectedIds);
  };

  const providerValue = {
    select: handleSelect,
    deselect: handleDeselect,
    deselectAll: handleDeselectAll,
    isSelected: handleIsSelected
  } as const;

  return <selectableContext.Provider value={providerValue}>{children}</selectableContext.Provider>;
};

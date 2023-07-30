import difference from "lodash/fp/difference";
import React, { useCallback, useState } from "react";

import { dimensionableContext } from "./dimensionable-provider.context";
import { SetDimension } from "./dimensionable-provider.context";
import { GetDimension } from "./dimensionable-provider.context";
import { DimensionableProviderProps } from "./dimensionable-provider.type";

export const DimensionableProvider: React.FC<DimensionableProviderProps> = ({ children }) => {
  const [dimensions, setDimensions] = useState<Record<string, { width: number; height: number }>>(
    {}
  );
  const [draggingIds, setDraggingIds] = useState<string[]>([]);

  const handleSetDimension = useCallback<SetDimension>(
    (id, width, height) => {
      setDraggingIds(difference(draggingIds)([id]));
      setDimensions({ ...dimensions, [id]: { width, height } });
    },
    [draggingIds, dimensions]
  );

  const handleGetDimension = useCallback<GetDimension>(
    (id) => {
      return dimensions[id] || { width: 50, height: 50 };
    },
    [dimensions]
  );

  const providerValue = {
    setDimension: handleSetDimension,
    getDimension: handleGetDimension
  } as const;

  return (
    <dimensionableContext.Provider value={providerValue}>{children}</dimensionableContext.Provider>
  );
};

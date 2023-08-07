import difference from "lodash/fp/difference";
import includes from "lodash/fp/includes";
import React, { useState } from "react";

import { uniqueOrderedStrings } from "~nyte-graf-core/util/array";

import { dimensionableContext } from "./dimensionable-provider.context";
import { ResizeStart } from "./dimensionable-provider.context";
import { ResizeEnd } from "./dimensionable-provider.context";
import { IsResizing } from "./dimensionable-provider.context";
import { SetDimension } from "./dimensionable-provider.context";
import { GetDimension } from "./dimensionable-provider.context";
import { DimensionableProviderProps } from "./dimensionable-provider.type";

export const DimensionableProvider: React.FC<DimensionableProviderProps> = ({ children }) => {
  const [dimensions, setDimensions] = useState<Record<string, { width: number; height: number }>>(
    {}
  );
  const [resizingIds, setResizingIds] = useState<string[]>([]);

  const handleResizeStart: ResizeStart = (id) => {
    setResizingIds((state) => {
      return uniqueOrderedStrings([...state, id]);
    });
  };

  const handleResizeEnd: ResizeEnd = (id) => {
    setResizingIds((state) => {
      return difference(state)([id]);
    });
  };

  const handleIsResizing: IsResizing = (id) => {
    return includes(id)(resizingIds);
  };

  const handleSetDimension: SetDimension = (id, width, height) => {
    setDimensions((state) => {
      return { ...state, [id]: { width, height } };
    });
  };

  const handleGetDimension: GetDimension = (id) => {
    return dimensions[id] || { width: 50, height: 50 };
  };

  return (
    <dimensionableContext.Provider
      value={{
        resizeStart: handleResizeStart,
        resizeEnd: handleResizeEnd,
        isResizing: handleIsResizing,
        setDimension: handleSetDimension,
        getDimension: handleGetDimension
      }}
    >
      {children}
    </dimensionableContext.Provider>
  );
};

import difference from "lodash/fp/difference";
import includes from "lodash/fp/includes";
import React, { useCallback, useState } from "react";

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

  const handleResizeStart = useCallback<ResizeStart>(
    (id) => {
      setResizingIds(uniqueOrderedStrings([...resizingIds, id]));
    },
    [resizingIds]
  );

  const handleResizeEnd = useCallback<ResizeEnd>(
    (id) => {
      setResizingIds(difference(resizingIds)([id]));
    },
    [resizingIds]
  );

  const handleIsResizing = useCallback<IsResizing>(
    (id) => {
      return includes(id)(resizingIds);
    },
    [resizingIds]
  );

  const handleSetDimension = useCallback<SetDimension>(
    (id, width, height) => {
      setDimensions({ ...dimensions, [id]: { width, height } });
    },
    [dimensions]
  );

  const handleGetDimension = useCallback<GetDimension>(
    (id) => {
      return dimensions[id] || { width: 50, height: 50 };
    },
    [dimensions]
  );

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

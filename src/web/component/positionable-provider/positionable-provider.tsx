import difference from "lodash/fp/difference";
import includes from "lodash/fp/includes";
import React, { useCallback, useState } from "react";

import { uniqueOrderedStrings } from "~nyte-graf-core/util/array";

import { positionableContext } from "./positionable-provider.context";
import { DragStart } from "./positionable-provider.context";
import { DragEnd } from "./positionable-provider.context";
import { IsDragging } from "./positionable-provider.context";
import { GetPosition } from "./positionable-provider.context";
import { SetPosition } from "./positionable-provider.context";
import { PositionableProviderProps } from "./positionable-provider.type";

export const PositionableProvider: React.FC<PositionableProviderProps> = ({ children }) => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingIds, setDraggingIds] = useState<string[]>([]);

  const handleDragStart = useCallback<DragStart>(
    (id) => {
      setDraggingIds(uniqueOrderedStrings([...draggingIds, id]));
    },
    [draggingIds]
  );

  const handleDragEnd = useCallback<DragEnd>(
    (id) => {
      setDraggingIds(difference(draggingIds)([id]));
    },
    [draggingIds]
  );

  const handleIsDragging = useCallback<IsDragging>(
    (id) => {
      return includes(id)(draggingIds);
    },
    [draggingIds]
  );

  const handleGetPosition = useCallback<GetPosition>(
    (id) => {
      return positions[id] || { x: 0, y: 0 };
    },
    [positions]
  );

  const handleSetPosition = useCallback<SetPosition>(
    (id, x, y) => {
      setPositions({ ...positions, [id]: { x, y } });
    },
    [positions]
  );

  const providerValue = {
    dragStart: handleDragStart,
    dragEnd: handleDragEnd,
    isDragging: handleIsDragging,
    getPosition: handleGetPosition,
    setPosition: handleSetPosition
  } as const;

  return (
    <positionableContext.Provider value={providerValue}>{children}</positionableContext.Provider>
  );
};

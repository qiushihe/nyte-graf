import difference from "lodash/fp/difference";
import includes from "lodash/fp/includes";
import React, { useCallback, useState } from "react";

import { uniqueOrderedStrings } from "~nyte-graf-core/util/array";

import { positionableContext } from "./positionable-provider.context";
import { MoveStart } from "./positionable-provider.context";
import { MoveEnd } from "./positionable-provider.context";
import { IsMoving } from "./positionable-provider.context";
import { GetPosition } from "./positionable-provider.context";
import { SetPosition } from "./positionable-provider.context";
import { PositionableProviderProps } from "./positionable-provider.type";

export const PositionableProvider: React.FC<PositionableProviderProps> = ({ children }) => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [movingIds, setMovingIds] = useState<string[]>([]);

  const handleMoveStart = useCallback<MoveStart>(
    (id) => {
      setMovingIds(uniqueOrderedStrings([...movingIds, id]));
    },
    [movingIds]
  );

  const handleMoveEnd = useCallback<MoveEnd>(
    (id) => {
      setMovingIds(difference(movingIds)([id]));
    },
    [movingIds]
  );

  const handleIsMoving = useCallback<IsMoving>(
    (id) => {
      return includes(id)(movingIds);
    },
    [movingIds]
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

  return (
    <positionableContext.Provider
      value={{
        moveStart: handleMoveStart,
        moveEnd: handleMoveEnd,
        isMoving: handleIsMoving,
        getPosition: handleGetPosition,
        setPosition: handleSetPosition
      }}
    >
      {children}
    </positionableContext.Provider>
  );
};

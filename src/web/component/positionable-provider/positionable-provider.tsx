import difference from "lodash/fp/difference";
import includes from "lodash/fp/includes";
import React, { useState } from "react";

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

  const handleMoveStart: MoveStart = (id) => {
    setMovingIds((state) => {
      return uniqueOrderedStrings([...state, id]);
    });
  };

  const handleMoveEnd: MoveEnd = (id) => {
    setMovingIds((state) => {
      return difference(state)([id]);
    });
  };

  const handleIsMoving: IsMoving = (id) => {
    return includes(id)(movingIds);
  };

  const handleGetPosition: GetPosition = (id) => {
    return positions[id] || { x: 0, y: 0 };
  };

  const handleSetPosition: SetPosition = (id, x, y) => {
    setPositions((state) => {
      return { ...state, [id]: { x, y } };
    });
  };

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

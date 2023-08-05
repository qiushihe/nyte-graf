import React, { useCallback } from "react";

import { Block } from "~nyte-graf-web/component/block";
import { useDimensionable } from "~nyte-graf-web/component/dimensionable-provider";
import { usePositionable } from "~nyte-graf-web/component/positionable-provider";
import { useSelectable } from "~nyte-graf-web/component/selectable-provider";

import { BlockInstanceProps } from "./block-instance.type";

export const BlockInstance: React.FC<BlockInstanceProps> = ({ id, isMovable, isResizable }) => {
  const { select, deselect, isSelected } = useSelectable();
  const { moveStart, moveEnd, isMoving, getPosition, setPosition } = usePositionable();
  const { resizeStart, resizeEnd, isResizing, getDimension, setDimension } = useDimensionable();

  const selected = isSelected(id);
  const position = getPosition(id);
  const dimension = getDimension(id);

  const handleBlockClick = useCallback(() => {
    if (selected) {
      deselect(id);
    } else {
      select(id);
    }
  }, [select, deselect, selected, id]);

  return (
    <Block
      x={position.x}
      y={position.y}
      width={dimension.width}
      height={dimension.height}
      onClick={handleBlockClick}
      isSelected={selected}
      isMovable={isMovable}
      isMoving={isMoving(id)}
      onMoveStart={() => moveStart(id)}
      onMoveEnd={() => moveEnd(id)}
      onMove={(x, y) => setPosition(id, x, y)}
      isResizable={isResizable}
      isResizing={isResizing(id)}
      onResizeStart={() => resizeStart(id)}
      onResizeEnd={() => resizeEnd(id)}
      onResize={(width, height) => setDimension(id, width, height)}
    />
  );
};

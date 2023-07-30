import React, { useCallback } from "react";

import { Block } from "~nyte-graf-web/component/block";
import { useDimensionable } from "~nyte-graf-web/component/dimensionable-provider";
import { usePositionable } from "~nyte-graf-web/component/positionable-provider";
import { useSelectable } from "~nyte-graf-web/component/selectable-provider";

import { BlockInstanceProps } from "./block-instance.type";

export const BlockInstance: React.FC<BlockInstanceProps> = ({ id, isDraggable }) => {
  const { select, deselect, isSelected } = useSelectable();
  const { dragStart, dragEnd, isDragging, getPosition, setPosition } = usePositionable();
  const { getDimension, setDimension } = useDimensionable();

  const position = getPosition(id);
  const selected = isSelected(id);
  const dragging = isDragging(id);
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
      isDraggable={isDraggable}
      isDragging={dragging}
      onDragStart={() => dragStart(id)}
      onDragEnd={(x, y) => {
        dragEnd(id);
        setPosition(id, x, y);
      }}
      onResized={(width, height) => setDimension(id, width, height)}
    />
  );
};

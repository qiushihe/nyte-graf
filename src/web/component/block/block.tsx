import React from "react";
import { Group, Text } from "react-konva";

import { BlockProps } from "./block.type";

export const Block: React.FC<BlockProps> = ({
  x,
  y,
  isDragging,
  isDraggable,
  onDragStart,
  onDragEnd
}) => {
  const draggableProps = isDraggable ? { draggable: true, onDragStart, onDragEnd } : {};

  return (
    <Group x={x} y={y} {...draggableProps}>
      <Text x={0} y={50} text="[BLOCK TITLE]" fill={isDragging ? "green" : "black"} />
      <Text x={0} y={100} text="[Block Body]" fill={isDragging ? "black" : "green"} />
    </Group>
  );
};

import Konva from "konva";
import React, { useCallback, useEffect, useRef } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";

import { BlockProps } from "./block.type";
import KonvaEventObject = Konva.KonvaEventObject;

export const Block: React.FC<BlockProps> = ({
  x,
  y,
  width,
  height,
  onClick,
  isSelected,
  isDraggable,
  isDragging,
  onDragStart,
  onDragEnd,
  onResized
}) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleClick = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      evt.cancelBubble = true;
      onClick();
    },
    [onClick]
  );

  return (
    <Group
      x={x}
      y={y}
      draggable={isDraggable}
      onDragStart={isDraggable ? () => onDragStart() : () => {}}
      onDragEnd={isDraggable ? (evt) => onDragEnd(evt.target.x(), evt.target.y()) : () => {}}
    >
      <Rect x={0} y={0} width={width} height={height} stroke="#000000" onClick={handleClick} />
      <Text x={0} y={50} text="[BLOCK TITLE]" fill={isDragging ? "green" : "black"} />
      <Text x={0} y={100} text="[Block Body]" fill={isDragging ? "black" : "green"} />
      {isSelected && (
        <>
          <Rect
            ref={shapeRef}
            x={0}
            y={0}
            width={width}
            height={height}
            stroke="#990000"
            onClick={handleClick}
            onTransformEnd={() => {
              // transformer is changing scale of the node
              // and NOT its width or height
              // but in the store we have only width and height
              // to match the data better we will reset scale on transform end
              const node = shapeRef.current;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();

              // we will reset it back
              node.scaleX(1);
              node.scaleY(1);

              // node.x()
              // node.y()
              onResized?.(node.width() * scaleX, node.height() * scaleY);
            }}
          />
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
            rotateEnabled={false}
            resizeEnabled={true}
            flipEnabled={false}
            borderEnabled={false}
            enabledAnchors={["bottom-right"]}
          />
        </>
      )}
    </Group>
  );
};

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
  isMovable,
  isMoving,
  onMoveStart,
  onMove,
  onMoveEnd,
  isResizable,
  isResizing,
  onResizeStart,
  onResizeEnd,
  onResize
}) => {
  const outlineRectRef = useRef<Konva.Rect>();
  const transformerRef = useRef<Konva.Transformer>();

  useEffect(() => {
    if (isSelected && transformerRef.current && outlineRectRef.current) {
      transformerRef.current.nodes([outlineRectRef.current]);
      transformerRef.current.getLayer().batchDraw();
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
      draggable={isMovable}
      onDragStart={isMovable ? () => onMoveStart?.() : () => {}}
      onDragMove={isMovable ? (evt) => onMove?.(evt.target.x(), evt.target.y()) : () => {}}
      onDragEnd={isMovable ? () => onMoveEnd?.() : () => {}}
    >
      <Rect x={0} y={0} width={width} height={height} stroke="#000000" onClick={handleClick} />
      <Text x={0} y={50} text="[BLOCK TITLE]" fill={isMoving || isResizing ? "green" : "black"} />
      <Text x={0} y={100} text="[Block Body]" fill={isMoving || isResizing ? "black" : "green"} />
      {isSelected && isResizable && (
        <>
          {/* The `Transformer` component is designed to manipulate the *scale*
              of a shep and not it's *dimension*. But manipulating the shape's
              dimension is exactly what we want to do.
              So here we use a fake "outline" rectangle for `Transformer` to
              manipulate, so the actual `Block` component's shapes wont look
              all wonky while the `Transformer` component is doing its
              things. */}
          <Rect
            ref={outlineRectRef}
            x={0}
            y={0}
            width={width}
            height={height}
            stroke="#990000"
            onClick={handleClick}
            onTransformStart={() => onResizeStart?.()}
            onTransform={(evt) => {
              // console.log("onTransform", evt.target.width(), evt.target.scaleX());

              // The `Transformer` component is designed to manipulate the
              // *scale* of a shep and not it's *dimension*. But manipulating
              // the shape's dimension is exactly what we want to do.
              // So while the `Transformer` component is in the process of
              // transforming the outline rectangle, we use some calculate the
              // effective dimensional change and apply it to the `Block`
              // component's `onResized` callback.
              onResize?.(
                evt.target.width() * evt.target.scaleX(),
                evt.target.height() * evt.target.scaleY()
              );
            }}
            onTransformEnd={(evt) => {
              // The `Transformer` component is designed to manipulate the
              // *scale* of a shep and not it's *dimension*. But manipulating
              // the shape's dimension is exactly what we want to do.
              // So upon the end of the transformation process, we have to
              // reset the scaling of the outline rectangle.
              evt.target.scaleX(1);
              evt.target.scaleY(1);
              onResizeEnd?.();
            }}
          />
          <Transformer
            ref={transformerRef}
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

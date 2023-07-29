import Konva from "konva";
import React from "react";

export type DraggableControllerState = {
  isDragging: boolean;
  x: number;
  y: number;
};

export type DraggableControllerCallbacks = {
  onDragStart: (evt: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (evt: Konva.KonvaEventObject<DragEvent>) => void;
};

export type DraggableControllerProps = {
  initialX: number;
  initialY: number;
  children: (state: DraggableControllerState & DraggableControllerCallbacks) => React.JSX.Element;
};

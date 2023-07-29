import Konva from "konva";

export type BlockProps = {
  x: number;
  y: number;
  isDragging?: boolean;
  isDraggable?: boolean;
  onDragStart?: (evt: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (evt: Konva.KonvaEventObject<DragEvent>) => void;
};

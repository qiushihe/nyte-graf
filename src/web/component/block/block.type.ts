export type BlockProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick?: () => void;
  isSelected?: boolean;
  isDraggable?: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onResized?: (width: number, height: number) => void;
};

export type BlockProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick?: () => void;
  isSelected?: boolean;
  isMovable?: boolean;
  isMoving?: boolean;
  onMoveStart?: () => void;
  onMoveEnd?: () => void;
  onMove?: (x: number, y: number) => void;
  isResizable?: boolean;
  isResizing?: boolean;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  onResize?: (width: number, height: number) => void;
};

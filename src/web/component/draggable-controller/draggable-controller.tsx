import React, { useState } from "react";

import { DraggableControllerProps } from "./draggable-controller.type";
import { DraggableControllerState } from "./draggable-controller.type";

export const DraggableController: React.FC<DraggableControllerProps> = ({
  initialX,
  initialY,
  children
}) => {
  const [draggableState, setDraggableState] = useState<DraggableControllerState>({
    isDragging: false,
    x: initialX,
    y: initialY
  });

  return children({
    ...draggableState,
    onDragStart: () => {
      setDraggableState({ ...draggableState, isDragging: true });
    },
    onDragEnd: (evt) => {
      setDraggableState({
        ...draggableState,
        isDragging: false,
        x: evt.target.x(),
        y: evt.target.y()
      });
    }
  });
};

import { AddCirclePayload } from "~nyte-graf-web/canvas-state/action/add-circle";
import { AddPolyLinePayload } from "~nyte-graf-web/canvas-state/action/add-poly-line";
import { AddRectanglePayload } from "~nyte-graf-web/canvas-state/action/add-rectangle";
import { RemoveShapePayload } from "~nyte-graf-web/canvas-state/action/remove-shape";
import { UpdateShapeStylePayload } from "~nyte-graf-web/canvas-state/action/update-shape-style";
import {
  CanvasState,
  Circle,
  PolyLine,
  Rectangle,
  ShapeInstance
} from "~nyte-graf-web/canvas-state/canvas-state.type";
import { StateMachineReducer } from "~nyte-graf-web/state-machine/state-machine.type";

const handleAddRectangle: StateMachineReducer<CanvasState, AddRectanglePayload> = {
  types: ["add-rectangle"],
  apply: (state, action) => {
    const shape: Rectangle = {
      type: "rectangle",
      posX: action.payload.posX,
      posY: action.payload.posY,
      width: action.payload.width,
      height: action.payload.height
    };

    const shapeInstance: ShapeInstance<Rectangle> = {
      id: action.payload.id,
      layerId: null,
      ...shape
    };

    return { ...state, shapes: [...state.shapes, shapeInstance] };
  }
};

const handleAddCircle: StateMachineReducer<CanvasState, AddCirclePayload> = {
  types: ["add-circle"],
  apply: (state, action) => {
    const shape: Circle = {
      type: "circle",
      posX: action.payload.posX,
      posY: action.payload.posY,
      radius: action.payload.radius
    };

    const shapeInstance: ShapeInstance<Circle> = {
      id: action.payload.id,
      layerId: null,
      ...shape
    };

    return { ...state, shapes: [...state.shapes, shapeInstance] };
  }
};

const handleAddPolyLine: StateMachineReducer<CanvasState, AddPolyLinePayload> = {
  types: ["add-poly-line"],
  apply: (state, action) => {
    const shape: PolyLine = {
      type: "poly-line",
      points: action.payload.points.map(([posX, posY]) => ({ posX, posY }))
    };

    const shapeInstance: ShapeInstance<PolyLine> = {
      id: action.payload.id,
      layerId: null,
      ...shape
    };

    return { ...state, shapes: [...state.shapes, shapeInstance] };
  }
};

const handleUpdateShapeStyle: StateMachineReducer<CanvasState, UpdateShapeStylePayload> = {
  types: ["update-shape-style"],
  apply: (state, action) => {
    const shape = state.shapes.find((shape) => shape.id === action.payload.id) || null;
    if (!shape) {
      return state;
    } else {
      return {
        ...state,
        shapes: [
          ...state.shapes.filter((shape) => shape.id !== action.payload.id),
          { ...shape, ...action.payload.style }
        ]
      };
    }
  }
};

const handleRemoveShape: StateMachineReducer<CanvasState, RemoveShapePayload> = {
  types: ["remove-shape"],
  apply: (state, action) => {
    if (!action.payload.id) {
      return state;
    } else {
      return {
        ...state,
        shapes: state.shapes.filter((shape) => shape.id !== action.payload.id)
      };
    }
  }
};

export const shapesReducers = [
  handleAddRectangle,
  handleAddCircle,
  handleAddPolyLine,
  handleUpdateShapeStyle,
  handleRemoveShape
];

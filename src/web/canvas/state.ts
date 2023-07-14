import flow from "lodash/fp/flow";

import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";
import { Coordinate } from "~nyte-graf-web/polygon/polygon.type";

import { Circle } from "./canvas.type";
import { PolyLine } from "./canvas.type";
import { Rectangle } from "./canvas.type";
import { ShapeInstance } from "./canvas.type";
import { Ref } from "./canvas.type";
import { State } from "./canvas.type";
import { Style } from "./canvas.type";

export const initialState = (): State => ({
  backgroundColor: "#ffffff",
  layerOrder: [],
  layers: [],
  shapes: []
});

export const createRef = (): Ref => ({ id: null });

export const addRectangle =
  ([posX, posY, width, height]: [number, number, number, number], ref?: Ref) =>
  (state: State): State => {
    const id = uuidV4();

    if (ref) {
      ref.id = id;
    }

    const shape: Rectangle = { type: "rectangle", posX, posY, width, height };

    const shapeInstance: ShapeInstance<Rectangle> = {
      id,
      layerId: null,
      ...shape
    };

    return { ...state, shapes: [...state.shapes, shapeInstance] };
  };

export const addCircle =
  ([posX, posY, radius]: [number, number, number], ref?: Ref) =>
  (state: State): State => {
    const id = uuidV4();

    if (ref) {
      ref.id = id;
    }

    const shape: Circle = { type: "circle", posX, posY, radius };

    const shapeInstance: ShapeInstance<Circle> = {
      id,
      layerId: null,
      ...shape
    };

    return { ...state, shapes: [...state.shapes, shapeInstance] };
  };

export const addPolyLine =
  (points: Coordinate[], ref?: Ref) =>
  (state: State): State => {
    const id = uuidV4();

    if (ref) {
      ref.id = id;
    }

    const shape: PolyLine = {
      type: "poly-line",
      points: points.map(([posX, posY]) => ({ posX, posY }))
    };

    const shapeInstance: ShapeInstance<PolyLine> = {
      id,
      layerId: null,
      ...shape
    };

    return { ...state, shapes: [...state.shapes, shapeInstance] };
  };

export const updateShapeStyle =
  (ref: Ref, style: Style) =>
  (state: State): State => {
    const shape = state.shapes.find((shape) => shape.id === ref.id) || null;
    if (!shape) {
      return state;
    } else {
      return {
        ...state,
        shapes: [...state.shapes.filter((shape) => shape.id !== ref.id), { ...shape, ...style }]
      };
    }
  };

export const removeShape =
  (id: string) =>
  (state: State): State => {
    return {
      ...state,
      shapes: state.shapes.filter((shape) => shape.id !== id)
    };
  };

export const setBackgroundColor =
  (color: string) =>
  (state: State): State => ({ ...state, backgroundColor: color });

export const stateMutator =
  (fns: ((input: State) => State)[]) =>
  (input: State): State =>
    flow(fns)(input);

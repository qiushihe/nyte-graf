import flow from "lodash/fp/flow";

import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";

import { Circle } from "./canvas.type";
import { PolyLine } from "./canvas.type";
import { Rectangle } from "./canvas.type";
import { Ref } from "./canvas.type";
import { Shape } from "./canvas.type";
import { State } from "./canvas.type";
import { Style } from "./canvas.type";

export const initialState = (): State => ({
  backgroundColor: "#ffffff",
  layerOrder: [],
  layers: [],
  shapes: []
});

export const createRectangle = (
  posX: number,
  posY: number,
  width: number,
  height: number
): Rectangle => ({
  type: "rectangle",
  posX,
  posY,
  width,
  height
});

export const createCircle = (posX: number, posY: number, radius: number): Circle => ({
  type: "circle",
  posX,
  posY,
  radius
});

export const createPolyLine = (...points: [number, number][]): PolyLine => ({
  type: "poly-line",
  points: points.map(([posX, posY]) => ({ posX, posY }))
});

export const createStyle =
  (style: Style) =>
  (shape: Shape): Shape => ({ ...shape, ...style });

export const createRef = (): Ref => ({ id: null });

export const addShapeInstance =
  <TShape extends Shape>(shape: TShape, ref?: Ref) =>
  (state: State): State => {
    const id = uuidV4();

    if (ref) {
      ref.id = id;
    }

    return {
      ...state,
      shapes: [...state.shapes, { ...shape, id, layerId: null }]
    };
  };

export const removeShapeInstance =
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

export const mutator =
  (fns: ((input: State) => State)[]) =>
  (input: State): State =>
    flow(fns)(input);

import flow from "lodash/fp/flow";

import { uuidV4 } from "~nyte-graf-core/util/uuid-v4";

export type Layer = { id: string };

type FillStyle = {
  fillColor?: string;
};

type StrokeStyle = {
  strokeWidth?: number;
  strokeColor?: string;
};

export type Style = FillStyle & StrokeStyle;

export type Rectangle = FillStyle &
  StrokeStyle & { type: "rectangle"; posX: number; posY: number; width: number; height: number };

export type Circle = FillStyle &
  StrokeStyle & { type: "circle"; posX: number; posY: number; radius: number };

export type PolyLine = StrokeStyle & {
  type: "poly-line";
  points: { posX: number; posY: number }[];
};

export type Shape = Rectangle | Circle | PolyLine;

export type Instance<TShape extends Shape> = {
  id: string;
  layerId: string | null;
} & TShape;

export type StateShape = Instance<Rectangle> | Instance<Circle> | Instance<PolyLine>;

export type State = {
  layerOrder: string[];
  layers: Layer[];
  shapes: StateShape[];
};

export const state = (): State => ({ layerOrder: [], layers: [], shapes: [] });

export const rectangle = (
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

export const circle = (posX: number, posY: number, radius: number): Circle => ({
  type: "circle",
  posX,
  posY,
  radius
});

export const polyLine = (...points: [number, number][]): PolyLine => ({
  type: "poly-line",
  points: points.map(([posX, posY]) => ({ posX, posY }))
});

export const style =
  (style: Style) =>
  (shape: Shape): Shape => ({ ...shape, ...style });

export const instance =
  <TShape extends Shape>(shape: TShape) =>
  (state: State): State => ({
    ...state,
    shapes: [...state.shapes, { ...shape, id: uuidV4(), layerId: null }]
  });

export const mutator =
  (fns: ((input: State) => State)[]) =>
  (input: State): State =>
    flow(fns)(input);

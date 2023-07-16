import { createAction } from "@reduxjs/toolkit";

import { Coordinate } from "~nyte-graf-web/polygon/polygon.type";

import { ShapeStyle } from "../store.type";
import { ActionPreparer } from "./action.type";
import { AddRectanglePayload } from "./shapes.type";
import { AddCirclePayload } from "./shapes.type";
import { AddPolyLinePayload } from "./shapes.type";
import { UpdateShapeStylePayload } from "./shapes.type";
import { RemoveShapePayload } from "./shapes.type";

export const ADD_RECTANGLE = "SHAPES/ADD_RECTANGLE";

export const addRectangle = createAction<
  ActionPreparer<[string, number, number, number, number], AddRectanglePayload>
>(ADD_RECTANGLE, (id, posX, posY, width, height) => {
  return {
    payload: { id, posX, posY, width, height }
  };
});

export const ADD_CIRCLE = "SHAPES/ADD_CIRCLE";

export const addCircle = createAction<
  ActionPreparer<[string, number, number, number], AddCirclePayload>
>(ADD_CIRCLE, (id, posX, posY, radius) => {
  return {
    payload: { id, posX, posY, radius }
  };
});

export const ADD_POLY_LINE = "SHAPES/ADD_POLY_LINE";

export const addPolyLine = createAction<ActionPreparer<[string, Coordinate[]], AddPolyLinePayload>>(
  ADD_POLY_LINE,
  (id, points) => {
    return {
      payload: { id, points }
    };
  }
);

export const UPDATE_SHAPE_STYLE = "SHAPES/UPDATE_SHAPE_STYLE";

export const updateShapeStyle = createAction<
  ActionPreparer<[string, ShapeStyle], UpdateShapeStylePayload>
>(UPDATE_SHAPE_STYLE, (id, style) => {
  return {
    payload: { id, style }
  };
});

export const REMOVE_SHAPE = "SHAPES/REMOVE_SHAPE";

export const removeShape = createAction<ActionPreparer<[string], RemoveShapePayload>>(
  REMOVE_SHAPE,
  (id) => {
    return {
      payload: { id }
    };
  }
);

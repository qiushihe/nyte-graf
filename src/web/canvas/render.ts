import * as CS from "./state";

const shapeStyleResetter = (ctx: CanvasRenderingContext2D) => () => {
  ctx.fillStyle = "#00000000";
  ctx.strokeStyle = "#00000000";
  ctx.lineWidth = 0;
};

const shapeStyleApplier = (ctx: CanvasRenderingContext2D) => (style: CS.Style) => {
  if (style.fillColor) {
    ctx.fillStyle = style.fillColor;
  }

  if (style.strokeColor) {
    ctx.strokeStyle = style.strokeColor;
  }

  if (style.strokeWidth) {
    ctx.lineWidth = style.strokeWidth;
  }
};

export const renderer =
  (canvas: HTMLCanvasElement) => (state: CS.State /* , previousState?: CS.State */) => {
    const ctx = canvas.getContext("2d");
    const resetShapeStyle = shapeStyleResetter(ctx);
    const applyShapeStyle = shapeStyleApplier(ctx);

    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    state.shapes.forEach((shape) => {
      // ctx.scale(1, 1);
      // ctx.translate(100, 100);

      resetShapeStyle();
      applyShapeStyle(shape);

      if (shape.type === "rectangle") {
        ctx.strokeRect(shape.posX, shape.posY, shape.width, shape.height);
        ctx.fillRect(shape.posX, shape.posY, shape.width, shape.height);
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.posX, shape.posY, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
      } else if (shape.type === "poly-line") {
        ctx.beginPath();
        shape.points.forEach(({ posX, posY }) => ctx.lineTo(posX, posY));
        ctx.stroke();
      } else {
        console.error("Unknown shape:", shape);
      }
    });
  };

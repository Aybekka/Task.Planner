import getStroke from "perfect-freehand";
import { PEN_TOOLS, adaptColorForTheme } from "./penTools";

function getSvgPathFromStroke(points) {
  if (!points.length) return "";
  const d = points.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      return `${acc} ${x0},${y0} ${(x0 + x1) / 2},${(y0 + y1) / 2}`;
    },
    `M ${points[0][0]},${points[0][1]} Q`
  );
  return `${d} Z`;
}

export function renderStrokes(ctx, strokes, bgColor = "#ffffff", darkMode = false) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const stroke of strokes) {
    drawStroke(ctx, stroke, darkMode);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

export function drawStroke(ctx, stroke, darkMode = false) {
  const config = PEN_TOOLS[stroke.tool] || PEN_TOOLS.ballpoint;
  ctx.globalAlpha = config.opacity;
  ctx.globalCompositeOperation = config.compositeOp;
  ctx.fillStyle = adaptColorForTheme(stroke.color, darkMode);

  if (config.textured) {
    const adaptedColor = adaptColorForTheme(stroke.color, darkMode);
    for (const [dx, dy] of [[-0.4, -0.4], [0, 0], [0.4, 0.4]]) {
      ctx.globalAlpha = config.opacity / 3;
      ctx.fillStyle = adaptedColor;
      const offsetPoints = stroke.points.map(([x, y, p]) => [x + dx, y + dy, p]);
      const outlinePoints = getStroke(offsetPoints, config);
      const path = new Path2D(getSvgPathFromStroke(outlinePoints));
      ctx.fill(path);
    }
  } else {
    const outlinePoints = getStroke(stroke.points, config);
    const path = new Path2D(getSvgPathFromStroke(outlinePoints));
    ctx.fill(path);
  }
}

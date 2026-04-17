import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStroke, clearStrokes } from "../../../store/tasksSlice";
import { selectDarkMode } from "../../../store/uiSlice";
import { useT } from "../../../i18n/useT";
import { renderStrokes, drawStroke } from "./strokeRenderer";
import { PEN_TOOLS, TOOL_ORDER, COLORS, adaptColorForTheme } from "./penTools";
import styles from "./DrawingCanvas.module.css";

const BASE_HEIGHT = 280;
const EXPAND_THRESHOLD = 40;
const EXPAND_AMOUNT = 140;

function getBgColor(darkMode) {
  return darkMode ? "#1e1e2e" : "#ffffff";
}

function getDefaultColor(darkMode) {
  return darkMode ? COLORS[0].dark : COLORS[0].light;
}

export default function DrawingCanvas({ taskId, strokes }) {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const t = useT();
  const darkModeRef = useRef(darkMode);
  const canvasRef = useRef(null);
  const strokesRef = useRef(strokes);
  const bgColorRef = useRef(getBgColor(darkMode));
  const activeStrokeRef = useRef(null);
  const rafRef = useRef(null);
  const isDrawing = useRef(false);
  const [activeTool, setActiveTool] = useState("ballpoint");
  const [activeColor, setActiveColor] = useState(() => getDefaultColor(darkMode));
  const [canvasHeight, setCanvasHeight] = useState(BASE_HEIGHT);

  // Re-render + adapt active color when theme changes
  useEffect(() => {
    const newBg = getBgColor(darkMode);
    bgColorRef.current = newBg;
    darkModeRef.current = darkMode;
    setActiveColor((prev) => adaptColorForTheme(prev, darkMode));
    const canvas = canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(rafRef.current);
    renderStrokes(canvas.getContext("2d"), strokesRef.current, newBg, darkMode);
  }, [darkMode]);

  // Keep strokesRef in sync, recalculate height, and re-render committed strokes
  useEffect(() => {
    strokesRef.current = strokes;

    // Shrink/grow canvas to fit strokes: find the lowest point across all strokes
    if (strokes.length === 0) {
      setCanvasHeight(BASE_HEIGHT);
    } else {
      let maxY = 0;
      for (const stroke of strokes) {
        for (const pt of stroke.points) {
          if (pt[1] > maxY) maxY = pt[1];
        }
      }
      // Keep padding below the lowest stroke; never go below BASE_HEIGHT
      setCanvasHeight(Math.max(BASE_HEIGHT, maxY + EXPAND_THRESHOLD + 20));
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(rafRef.current);
    renderStrokes(canvas.getContext("2d"), strokes, bgColorRef.current, darkModeRef.current);
  }, [strokes]);

  // Size canvas on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const w = Math.round(canvas.offsetWidth);
      const h = Math.round(canvas.offsetHeight);
      if (!w || !h) return;
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      renderStrokes(canvas.getContext("2d"), strokesRef.current, bgColorRef.current, darkModeRef.current);
    };

    const ro = new ResizeObserver(() => requestAnimationFrame(resize));
    ro.observe(canvas);
    requestAnimationFrame(resize);
    return () => ro.disconnect();
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top, e.pressure ?? 0.5];
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    activeStrokeRef.current = {
      tool: activeTool,
      color: activeTool === "eraser" ? "#000000" : activeColor,
      points: [getPos(e)],
    };
  };

  const onPointerMove = (e) => {
    if (!isDrawing.current || !activeStrokeRef.current) return;
    activeStrokeRef.current.points.push(getPos(e));

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      renderStrokes(ctx, strokesRef.current, bgColorRef.current, darkModeRef.current);
      drawStroke(ctx, activeStrokeRef.current, darkModeRef.current);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    });
  };

  const onPointerUp = () => {
    if (!isDrawing.current || !activeStrokeRef.current) return;
    isDrawing.current = false;
    cancelAnimationFrame(rafRef.current);

    const stroke = activeStrokeRef.current;
    activeStrokeRef.current = null;

    if (stroke.points.length > 1) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        renderStrokes(ctx, strokesRef.current, bgColorRef.current, darkModeRef.current);
        drawStroke(ctx, stroke, darkModeRef.current);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      // Auto-expand if any point is near the bottom edge
      const canvasH = canvas ? canvas.height : canvasHeight;
      const maxY = Math.max(...stroke.points.map((p) => p[1]));
      if (maxY >= canvasH - EXPAND_THRESHOLD) {
        setCanvasHeight((h) => h + EXPAND_AMOUNT);
      }

      dispatch(addStroke({ taskId, stroke }));
    } else {
      const canvas = canvasRef.current;
      if (canvas) renderStrokes(canvas.getContext("2d"), strokesRef.current, bgColorRef.current, darkModeRef.current);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          {TOOL_ORDER.map((tool) => (
            <button
              key={tool}
              className={`${styles.toolBtn} ${activeTool === tool ? styles.activeBtn : ""}`}
              onClick={() => setActiveTool(tool)}
              title={t.penTools[tool]}
            >
              {t.penTools[tool]}
            </button>
          ))}
        </div>
        <div className={styles.colorGroup}>
          {COLORS.map((color) => {
            const hex = darkMode ? color.dark : color.light;
            return (
              <button
                key={color.label}
                className={`${styles.colorSwatch} ${activeColor === hex ? styles.activeSwatch : ""}`}
                style={{ backgroundColor: hex }}
                onClick={() => {
                  setActiveColor(hex);
                  if (activeTool === "eraser") setActiveTool("ballpoint");
                }}
                title={color.label}
                aria-label={color.label}
              />
            );
          })}
        </div>
        <button
          className={styles.clearBtn}
          onClick={() => dispatch(clearStrokes(taskId))}
          title={t.drawingCanvas.clear}
        >
          {t.drawingCanvas.clear}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ touchAction: "none", cursor: activeTool === "eraser" ? "cell" : "crosshair", height: canvasHeight }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}

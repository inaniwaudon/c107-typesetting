import { createCanvas } from "canvas";
import { writeFileSync } from "node:fs";

export type Size = { w: number; h: number };

export type PageRect = Size & {
  x: number;
  y: number;
  page: number;
  type: "line" | "figure";
};

export type Item = Size & {
  type: "line" | "figure";
  columns: 1 | 2;
};

export const pageSize: Size = { w: 210, h: 297 };
export const padding = { x: 25, y: 25 };
export const columnGap = 10;
export const hanmenSize: Size = {
  w: pageSize.w - padding.x * 2,
  h: pageSize.h - padding.y * 2,
};

const lineHeight = 22 / 4;
const fontSize = 12 / 4;
const figureGap = 8;
const scale = 5;

export const columnWidth = (pageSize.w - padding.x * 2 - columnGap) / 2;

const scalePageRect = ({ x, y, w, h, page }: PageRect) => {
  return {
    x: x * scale,
    y: y * scale,
    w: w * scale,
    h: h * scale,
    page: page,
  };
};

const getBaseWidth = (columns: 1 | 2) => {
  return columns === 1 ? columnWidth * 2 + columnGap : columnWidth;
};

export const generateParagraph = (lines: number, columns: 1 | 2 = 2) => {
  const items: Item[] = [];
  for (let i = 0; i < lines; i++) {
    const ratio = i === lines - 1 ? 0.6 : 1;
    const w = getBaseWidth(columns) * ratio;
    items.push({
      type: "line",
      columns,
      w,
      h: lineHeight,
    });
  }
  return items;
};

export const generateFigure = (columns: 1 | 2 = 2): Item => {
  return {
    type: "figure",
    columns,
    w: getBaseWidth(columns),
    h: 40,
  };
};

export const generateItems = () => {
  return [
    ...generateParagraph(8),
    generateFigure(),
    ...generateParagraph(10),
    generateFigure(),
    generateFigure(),
    generateFigure(),
    ...generateParagraph(10),
    ...generateParagraph(5),
    generateFigure(),
    ...generateParagraph(8),
    ...generateParagraph(4),
    ...generateParagraph(6),
    generateFigure(),
    ...generateParagraph(10),
    ...generateParagraph(5),
  ];
};

export const drawAndSaveCanvas = (rects: PageRect[], index: number) => {
  const canvas = createCanvas(pageSize.w * scale, pageSize.h * scale);
  const context = canvas.getContext("2d");
  const maxPage = Math.max(...rects.map((rect) => rect.page)) + 1;

  for (let i = 0; i < maxPage; i++) {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, pageSize.w * scale, pageSize.h * scale);
    context.fillStyle = "#999";
    const pageRects = rects.filter((rect) => rect.page === i);

    for (const rect of pageRects) {
      if (rect.type === "figure") {
        rect.h -= figureGap;
      } else {
        rect.h = fontSize;
      }
      const scaledRect = scalePageRect(rect);
      context.fillRect(scaledRect.x, scaledRect.y, scaledRect.w, scaledRect.h);
    }
    const buffer = canvas.toBuffer("image/png");
    writeFileSync(`output${index}-${i}.png`, buffer);
  }
};

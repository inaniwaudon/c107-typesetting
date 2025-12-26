import {
  columnGap,
  columnWidth,
  drawAndSaveCanvas,
  generateParagraph,
  hanmenSize,
  padding,
  type PageRect,
} from "./utils";

const main = () => {
  const paragraphs = [...Array(20)].flatMap(() =>
    generateParagraph(5 + Math.round(Math.random() * 5))
  );

  let page = 0;
  let columnType: "left" | "right" = "left";
  let y = 0;
  const rects: PageRect[] = [];

  for (const paragraph of paragraphs) {
    // 版面を越えた場合、次の段またはページに送る
    if (y + paragraph.h > hanmenSize.h) {
      if (columnType === "left") {
        columnType = "right";
      } else {
        columnType = "left";
        page++;
      }
      y = 0;
    }

    rects.push({
      x: padding.x + (columnType === "right" ? columnWidth + columnGap : 0),
      y: padding.y + y,
      w: paragraph.w,
      h: paragraph.h,
      type: "line",
      page,
    });

    y += paragraph.h;
  }

  drawAndSaveCanvas(rects, 1);
};

main();

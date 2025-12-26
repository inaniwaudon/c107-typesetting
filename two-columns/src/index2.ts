import {
  columnGap,
  columnWidth,
  drawAndSaveCanvas,
  generateItems,
  hanmenSize,
  padding,
  type PageRect,
} from "./utils";

const main = () => {
  const items = generateItems();

  let page = 0;
  let columnType: "left" | "right" = "left";
  let y = 0;
  const rects: PageRect[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // 版面を越えた場合、次の段またはページに送る
    if (y + item.h > hanmenSize.h) {
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
      w: item.w,
      h: item.h,
      type: item.type,
      page,
    });

    y += item.h;
  }

  drawAndSaveCanvas(rects, 2);
};

main();

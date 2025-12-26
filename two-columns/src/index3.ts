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
  let columnType: string = "left";
  let y = 0;
  const rects: PageRect[] = [];

  const nextColumn = () => {
    if (columnType === "left") {
      columnType = "right";
    } else {
      columnType = "left";
      page++;
    }
    y = 0;
  };

  while (items.length > 0) {
    const firstTypeSize = items[0];
    let index = 0;

    // 版面を越えた場合
    if (y + firstTypeSize.h > hanmenSize.h) {
      // 行の場合、次の段またはページに送る
      if (firstTypeSize.type === "line") {
        nextColumn();
      }
      // 図版の場合
      if (firstTypeSize.type === "figure") {
        let lineFound = false;
        for (let i = 1; i < items.length; i++) {
          // 次に最初に現れる行が版面内に収まるかを判定
          if (items[i].type === "line" && y + items[i].h <= hanmenSize.h) {
            lineFound = true;
            index = i;
            break;
          }
        }
        if (!lineFound) {
          nextColumn();
        }
      }
    }

    const item = items[index];
    rects.push({
      x: padding.x + (columnType === "right" ? columnWidth + columnGap : 0),
      y: padding.y + y,
      w: item.w,
      h: item.h,
      type: item.type,
      page,
    });

    y += item.h;
    items.splice(index, 1);
  }

  drawAndSaveCanvas(rects, 3);
};

main();

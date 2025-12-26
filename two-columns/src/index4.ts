import {
  columnGap,
  columnWidth,
  drawAndSaveCanvas,
  generateItems,
  hanmenSize,
  Item,
  padding,
  PageRect,
} from "./utils";

type ColumnItem = Item & {
  columnType: string;
};

const main = () => {
  const items = generateItems();

  let columnType: string = "left";
  let y = 0;
  const columnItemsByPage: ColumnItem[][] = [[]];

  const nextColumn = () => {
    if (columnType === "left") {
      columnType = "right";
    } else {
      columnType = "left";
      columnItemsByPage.push([]);
    }
    y = 0;
  };

  while (items.length > 0) {
    const firstItem = items[0];
    let index = 0;

    // 版面を越えた場合
    if (y + firstItem.h > hanmenSize.h) {
      // 行の場合、次の段またはページに送る
      if (firstItem.type === "line") {
        nextColumn();
      }
      // 図版の場合
      if (firstItem.type === "figure") {
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
    columnItemsByPage.at(-1)!.push({
      type: item.type,
      columns: item.columns,
      w: item.w,
      h: item.h,
      columnType,
    });

    y += item.h;
    items.splice(index, 1);
  }

  const rects: PageRect[] = [];

  for (let i = 0; i < columnItemsByPage.length; i++) {
    const page = columnItemsByPage[i];

    // 段ごとに figure を上側にソート
    for (const columnType of ["left", "right"]) {
      const columnItems = page.filter((item) => item.columnType === columnType);
      const figures = columnItems.filter((item) => item.type === "figure");
      const lines = columnItems.filter((item) => item.type === "line");
      const x =
        padding.x + (columnType === "right" ? columnWidth + columnGap : 0);
      let y = 0;

      for (const item of [...figures, ...lines]) {
        rects.push({
          x,
          y: padding.y + y,
          w: item.w,
          h: item.h,
          type: item.type,
          page: i,
        });
        y += item.h;
      }
    }
  }

  drawAndSaveCanvas(rects, 4);
};

main();

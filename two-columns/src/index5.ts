import {
  columnGap,
  columnWidth,
  drawAndSaveCanvas,
  generateFigure,
  generateItems,
  generateParagraph,
  hanmenSize,
  Item,
  padding,
  PageRect,
} from "./utils";

type ColumnItem = Item & {
  columnType: string;
};

const main = () => {
  const allItems = [
    ...generateParagraph(3, 1),
    generateFigure(1),
    ...generateItems(),
    generateFigure(1),
    ...generateParagraph(4, 1),
    ...generateParagraph(8, 2),
    ...generateParagraph(6, 2),
    ...generateParagraph(10, 2),
    generateFigure(2),
    ...generateParagraph(8, 2),
    generateFigure(2),
    generateFigure(2),
    ...generateParagraph(4, 2),
  ];

  // 段数ごとにブロックとして区分
  const itemsByBlock: Item[][] = [];
  let beforeColumns: 1 | 2 | null = null;
  for (const item of allItems) {
    if (item.columns !== beforeColumns) {
      beforeColumns = item.columns;
      itemsByBlock.push([]);
    }
    itemsByBlock.at(-1)!.push(item);
  }

  // [ページ][ブロック] をキーとする要素の配列
  const columnItemsByPage: { columns: ColumnItem[]; columnY: number }[][] = [
    [],
  ];
  let columnY = 0;
  let columnType: string = "left";

  for (const items of itemsByBlock) {
    // 初期化
    let yInBlock = 0;
    columnType = "left";
    columnItemsByPage.at(-1)!.push({ columns: [], columnY });
    const currentColumns = items[0].columns;

    // 改ページする
    const breakPage = () => {
      columnY = 0;
      columnItemsByPage.push([{ columns: [], columnY }]);
    };

    // 次の段またはページに送る
    const nextColumn = () => {
      // 一段組の場合
      if (currentColumns === 1) {
        breakPage();
      }
      // 二段組の場合
      else {
        if (columnType === "left") {
          columnType = "right";
        } else {
          columnType = "left";
          breakPage();
        }
      }
      yInBlock = 0;
    };

    const overflows = (item: Item) => {
      return yInBlock + item.h > hanmenSize.h - columnY;
    };

    while (items.length > 0) {
      let index = 0;

      // 版面を超えた場合
      if (overflows(items[0])) {
        // 行の場合、次の段またはページに送る
        if (items[0].type === "line") {
          nextColumn();
        }
        // 図版の場合
        if (items[0].type === "figure") {
          let lineFound = false;
          for (let i = 1; i < items.length; i++) {
            // 次に最初に現れる行が版面内に収まるかを判定
            if (items[i].type === "line" && !overflows(items[i])) {
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
      columnItemsByPage.at(-1)!.at(-1)!.columns.push({
        type: item.type,
        columns: item.columns,
        w: item.w,
        h: item.h,
        columnType,
      });
      items.splice(index, 1);
      yInBlock += item.h;
    }

    // 最終ページのブロックの左右の段ができるだけ均等になるようにする
    if (currentColumns === 2) {
      const leftItems = structuredClone(
        columnItemsByPage.at(-1)!.at(-1)!.columns
      );
      const rightItems: ColumnItem[] = [];

      const isRightColumnLarger = (item: ColumnItem) => {
        const leftHeight = leftItems.reduce((acc, inItem) => acc + inItem.h, 0);
        const rightHeight = rightItems.reduce(
          (acc, inItem) => acc + inItem.h,
          0
        );
        return rightHeight + item.h > leftHeight - item.h;
      };

      // 左側の最後の要素を右の先頭に移していく
      while (leftItems.length > 0) {
        const lastItem = leftItems.at(-1)!;
        let index = leftItems.length - 1;

        if (isRightColumnLarger(lastItem)) {
          if (lastItem.type === "line") {
            break;
          }
          if (lastItem.type === "figure") {
            let lineFound = false;
            for (let i = leftItems.length - 2; i >= 0; i--) {
              if (
                leftItems[i].type === "line" &&
                !isRightColumnLarger(leftItems[i])
              ) {
                lineFound = true;
                index = i;
                break;
              }
            }
            if (!lineFound) {
              break;
            }
          }
          break;
        }

        const item = leftItems[index];
        leftItems.splice(index, 1);
        rightItems.splice(0, 0, {
          ...item,
          columnType: "right",
        });
      }

      columnItemsByPage.at(-1)!.at(-1)!.columns = [
        ...leftItems.map((item) => ({ ...item, columnType: "left" })),
        ...rightItems,
      ];
      yInBlock = leftItems.reduce((acc, item) => acc + item.h, 0);
    }

    columnY += yInBlock + 8;
  }

  const rects: PageRect[] = [];

  for (let i = 0; i < columnItemsByPage.length; i++) {
    const page = columnItemsByPage[i];

    // 段ごとに figure を上側にソート
    for (const { columnY, columns } of page) {
      for (const columnType of ["left", "right"]) {
        const columnItems = columns.filter(
          (item) => item.columnType === columnType
        );
        const figures = columnItems.filter((item) => item.type === "figure");
        const lines = columnItems.filter((item) => item.type === "line");
        const x =
          padding.x + (columnType === "right" ? columnWidth + columnGap : 0);
        let y = columnY;

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
  }

  drawAndSaveCanvas(rects, 5);
};

main();

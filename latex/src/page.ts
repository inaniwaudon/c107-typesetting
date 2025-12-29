import { createWorker, Worker } from "tesseract.js";
import sharp from "sharp";

import { typesetLaTeX, saveFirstPageImage } from "./utils";

const text = `Section 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Section 2
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Section 3
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Section 4
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Section 5
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.`;

const sectionName = "Section 4";

/**
 * OCR により、左段・右段の行を取得する
 * @param dir ディレクトリ
 * @param worker Tesseract.js の worker
 * @returns 行数
 */
const getLeftAndRightLinesWithOCR = async (dir: string, worker: Worker) => {
  await saveFirstPageImage(dir);

  // main.png を左半分と右半分で分割
  const image = sharp(`${dir}/main.png`);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;
  const halfWidth = Math.floor(width / 2);

  await sharp(`${dir}/main.png`)
    .extract({ left: 0, top: 0, width: halfWidth, height })
    .toFile(`${dir}/main-left.png`);
  await sharp(`${dir}/main.png`)
    .extract({ left: halfWidth, top: 0, width: width - halfWidth, height })
    .toFile(`${dir}/main-right.png`);

  // OCR
  const getLines = async (direction: string) => {
    const recognition = await worker.recognize(
      `${dir}/main-${direction}.png`,
      {},
      { blocks: true }
    );
    const block = recognition.data.blocks![0];
    const paragraphs = block.paragraphs;
    return paragraphs.flatMap((paragraph) =>
      paragraph.lines.map((line) => line.text.trim())
    );
  };
  return [await getLines("left"), await getLines("right")];
};

// 2つの文字列間の編集距離を計算
const getLevenshteinDistance = (a: string, b: string): number => {
  const tmp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    tmp[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // 削除
        tmp[i][j - 1] + 1, // 挿入
        tmp[i - 1][j - 1] + cost // 置換
      );
    }
  }
  return tmp[a.length][b.length];
};

const matchOCRLines = (originalText: string, ocrLines: string[]) => {
  let currentIndex = 0;
  const results: {
    ocrLine: string;
    matchedText: string;
    indices: number[];
  }[] = [];

  for (const line of ocrLines) {
    const normalizedLine = line;
    const searchLength = normalizedLine.length;
    let bestMatch = {
      score: Infinity,
      start: currentIndex,
      end: currentIndex + line.length,
    };

    const searchRange = 20;
    const searchEnd = Math.min(
      originalText.length,
      currentIndex + searchLength * 2 + searchRange
    );

    // スライディングウィンドウで最適な箇所を探す
    for (let i = currentIndex; i < searchEnd; i++) {
      for (let len = searchLength - 5; len <= searchLength + 5; len++) {
        const candidate = originalText.substring(i, i + len);
        const normalizedCandidate = candidate;
        const distance = getLevenshteinDistance(
          normalizedLine,
          normalizedCandidate
        );

        if (distance < bestMatch.score) {
          bestMatch = {
            score: distance,
            start: i,
            end: i + len,
          };
        }
        if (distance === 0) {
          break;
        }
      }
      if (bestMatch.score === 0) {
        break;
      }
    }

    results.push({
      ocrLine: line,
      matchedText: originalText.substring(bestMatch.start, bestMatch.end),
      indices: [bestMatch.start, bestMatch.end],
    });
    currentIndex = bestMatch.end;
  }

  return results;
};

const toParagraphs = (text: string) => {
  return text.split("\n").map((line) => {
    const section = line.includes("Section");
    return {
      words: line.split(" ").map((word) => ({
        text: word,
        colorRatio: 0,
      })),
      section,
    };
  });
};

const main = async () => {
  const worker = await createWorker("eng");
  let newText = text;
  let currentLineOffset = 0;
  let sectionLineIndex: number | null = null;
  let leftLineMatches: ReturnType<typeof matchOCRLines> | null = null;

  for (;;) {
    // 組版を実行
    // 初回はすべてのテキストを組版する。2回目以降は所定の行数まで削る
    if (leftLineMatches && sectionLineIndex !== null) {
      newText =
        text.slice(
          0,
          leftLineMatches[sectionLineIndex + currentLineOffset].indices[0]
        ) +
        "\n" +
        text.slice(leftLineMatches[sectionLineIndex].indices[0]);
    }
    const paragraphs = toParagraphs(newText);
    typesetLaTeX(paragraphs, "latex");

    // OCR で行を取得
    const [leftLines, rightLines] = await getLeftAndRightLinesWithOCR(
      "latex",
      worker
    );
    const allOcrLines = [...leftLines, ...rightLines];
    leftLineMatches ??= matchOCRLines(text, allOcrLines);

    // sectionName が表れる行を探す
    let bestMatch = {
      line: "",
      lineIndex: -1,
      score: Infinity,
    };

    for (let i = 0; i < allOcrLines.length; i++) {
      const ocrLine = allOcrLines[i];
      const distance = getLevenshteinDistance(
        ocrLine.replace(/\s/g, "").toLowerCase(),
        sectionName.replace(/\s/g, "").toLowerCase()
      );
      if (distance < bestMatch.score) {
        bestMatch = {
          line: ocrLine,
          lineIndex: i,
          score: distance,
        };
      }
    }

    // 左段に sectionName が表れるまで繰り返す
    const isRight = bestMatch.lineIndex >= leftLines.length;
    if (!isRight) {
      break;
    }
    currentLineOffset -= 1;
    sectionLineIndex ??= bestMatch.lineIndex;
  }
  console.log(currentLineOffset);
  await worker.terminate();
};

main();

import fs from "node:fs";
import { createWorker, Worker } from "tesseract.js";
import pLimit from "p-limit";

import { typesetLaTeX, saveFirstPageImage } from "./utils";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const n = 2;

/**
 * 行数を数える
 * @param dir ディレクトリ
 * @param worker Tesseract.js の worker
 * @returns 行数
 */
const countLines = async (dir: string, worker: Worker) => {
  await saveFirstPageImage(dir);

  // OCR
  const recognition = await worker.recognize(
    `${dir}/main.png`,
    {},
    { blocks: true }
  );
  const block = recognition.data.blocks![0];
  const paragraph = block.paragraphs[0];
  return paragraph.lines.length;
};

const main = async () => {
  const words = text.split(" ").map((word) => ({ text: word, colorRatio: 0 }));

  // 元々の行数を算出
  const worker = await createWorker("eng");
  typesetLaTeX([{ words }], "latex");
  const originalLines = await countLines("latex", worker);

  const resultWords = structuredClone(words);
  const promises: Promise<void>[] = [];
  const limit = pLimit(20);

  // i 単語をずつ削除して行数の変化を調査
  for (let i = n - 1; i >= 0; i--) {
    console.log(`Deleting ${i} word each...`);
    fs.mkdirSync("temp");

    for (let j = 0; j < words.length - i; j++) {
      const promise = limit(async () => {
        console.log(`${j + 1} / ${words.length}`);
        const filteredWords = words.filter((_, j1) => j1 < j || j + i < j1);
        const dir = `temp/${j}`;
        fs.mkdirSync(dir);
        fs.copyFileSync("latex/template.tex", `${dir}/template.tex`);

        typesetLaTeX([{ words: filteredWords }], dir);
        const lines = await countLines(dir, worker);
        if (lines < originalLines) {
          // 短い単語で削除できる場合はより赤く
          resultWords[j].colorRatio = 1 - i / n;
        }
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    fs.rmSync("temp", { recursive: true, force: true });
  }
  await worker.terminate();

  // 結果をコンパイル
  typesetLaTeX([{ words: resultWords }], "latex");
};

main();

import fs from "node:fs";
import { execSync } from "child_process";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";

export interface Word {
  text: string;
  colorRatio: number;
}

/**
 * LaTeX ファイルに文章を挿入してコンパイルする
 * @param paragraphs 段落の配列
 * @param dir ディレクトリ
 */
export const typesetLaTeX = (
  paragraphs: { words: Word[]; section?: boolean }[],
  dir: string
) => {
  const latexTemplateFile = `${dir}/template.tex`;
  const latexFile = `${dir}/main.tex`;

  let text = "";
  for (const paragraph of paragraphs) {
    if (paragraph.section) {
      text += `\\section{${paragraph.words.map(({ text }) => text).join(" ")}}`;
    } else {
      text += paragraph.words
        .map(({ text, colorRatio }) => {
          if (colorRatio === 0) {
            return text;
          }
          return `\\textcolor[rgb]{${
            Math.floor(colorRatio * 10) / 10
          },0,0}{${text}}`;
        })
        .join(" ");
    }
    text += "\n\n";
  }

  const template = fs.readFileSync(latexTemplateFile, "utf-8");
  const document = template.replace("$body", text);
  fs.writeFileSync(latexFile, document);
  execSync(`latexmk main.tex`, { cwd: dir });
};

/**
 * PDF の最初のページを画像として保存する
 * @param page PDF のページ
 * @param dir 保存先のディレクトリ
 */
export const saveFirstPageImage = async (dir: string) => {
  // PDF を読み込み
  const pdfPath = `${dir}/main.pdf`;
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = getDocument({
    data: data,
  });
  const doc = await loadingTask.promise;
  const page = await doc.getPage(1);

  // 画像として保存
  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = createCanvas(viewport.width, viewport.height);
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const render = page.render({ canvas: canvas as any, viewport: viewport });
  await render.promise;
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`${dir}/main.png`, buffer);
};

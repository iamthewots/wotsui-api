import { ElementData, Options } from "../_types";

export default async function rewriteElement(
  data: ElementData,
  options: Options
) {
  const { length, textData } = data;
  let i = 0;
  for (const td of textData) {
    const { node, textContent } = td;
    if (!textContent) {
      continue;
    }
    for (const char of textContent) {
      node.textContent += char;
      const ttw = getTimeToWait(char, options);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, ttw);
      });
    }
    i++;
  }
}

function getTimeToWait(char: string, options: Options) {
  const tpc = options.timePerChar;
  if (options.ignorePunctuation) {
    return tpc;
  }

  if (char.match(/\W/g)) {
    if (char.match(/[\@\{\}\[\]\(\)]/)) {
      return tpc * 4;
    }
    if (char.match(/[\,\>\<\%\$\€]/)) {
      return tpc * 8;
    }
    if (char.match(/[:;]/)) {
      return tpc * 16;
    }
    if (char.match(/[\.\?\!]/)) {
      return tpc * 24;
    }
  }
  return tpc;
}

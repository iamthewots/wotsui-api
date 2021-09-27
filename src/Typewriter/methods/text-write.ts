import { Options, Status } from "../types.js";
import Typewriter from "../Typewriter.js";

export default async function writeText(this: Typewriter, el: Element) {
  const elData = this.elementsData.get(el);
  if (!elData || elData.status === Status.InProgress) {
    return;
  }

  elData.status = Status.InProgress;
  const opt = this.getOptions(el);
  const { textNodesData, lastNodeIndex, lastCharIndex } = elData;
  for (let i = 0; i < textNodesData.length; i++) {
    const { node, text } = textNodesData[i];
    if (!text || text === "" || i < lastNodeIndex) {
      continue;
    }

    for (
      let j = i === lastNodeIndex ? lastCharIndex : 0;
      j < text.length;
      j++
    ) {
      if (elData.status !== Status.InProgress) {
        elData.lastNodeIndex = i;
        elData.lastCharIndex = j;
        return;
      }

      const char = text[j];
      node.textContent += char;
      const ttw = getTimeToWait(char, opt);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, ttw);
      });
    }
  }
  elData.status = Status.Initial;
  elData.lastNodeIndex = textNodesData.length - 1;
  elData.lastNodeIndex =
    textNodesData[textNodesData.length - 1].text.length - 1;
}

function getTimeToWait(char: string, opt: Options) {
  const tpc = opt.timePerChar;
  if (opt.ignorePunctuation) {
    return tpc;
  }
  if (char.match(/\W/g)) {
    if (char.match(/[\@\{\}\[\]\(\)]/)) {
      return tpc * 3;
    }
    if (char.match(/[\,\>\<\%\$\€]/)) {
      return tpc * 6;
    }
    if (char.match(/[:;]/)) {
      return tpc * 9;
    }
    if (char.match(/[\.\?\!]/)) {
      return tpc * 12;
    }
  }
  return tpc;
}

import { Options, Status } from "../types.js";
import Typewriter from "../Typewriter";

export default async function writeText(this: Typewriter, el: Element) {
  const data = this.elementsData.get(el);
  if (!data) {
    return;
  }

  const { textNodes, status, changeStatus } = data;
  const options = this.getOptions(el);
  changeStatus.isAllowed = true;
  if (status === Status.Active) {
    return;
  }

  for (let x = changeStatus.lastNodeIndex; x < textNodes.length; x++) {
    changeStatus.lastNodeIndex = x;
    const { node, textContent } = textNodes[x];
    if (!textContent || textContent === "") {
      continue;
    }
    for (let y = changeStatus.lastCharIndex; y < textContent.length; y++) {
      changeStatus.lastCharIndex = y;
      if (!changeStatus.isAllowed) {
        changeStatus.lastNodeIndex = x;
        changeStatus.lastCharIndex = y;
        this.setStatus(el, Status.Partial);
        return;
      }

      const char = textContent[y];
      node.textContent += char;
      const timeToWait = getTimeToWait(char, options);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, timeToWait);
      });
    }
  }
  changeStatus.isAllowed = false;
  const lni = textNodes.length - 1;
  const lci = textNodes[lni].textContent.length - 1;
  changeStatus.lastNodeIndex = lni;
  changeStatus.lastCharIndex = lci;
  this.setStatus(el, Status.Initial);
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

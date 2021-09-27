import { Options, Status } from "../types.js";
import Typewriter from "../Typewriter";

export default async function deleteText(this: Typewriter, el: Element) {
  const elData = this.elementsData.get(el);
  if (!elData || elData.status === Status.InProgress) {
    return;
  }

  elData.status = Status.InProgress;
  const opt = this.getOptions(el);
  const { textNodesData, lastNodeIndex } = elData;
  let i = lastNodeIndex;
  for (; i >= 0; i--) {
    const { node, text } = textNodesData[i];
    if (!text || text === "" || !node.textContent) {
      continue;
    }

    while (node.textContent && node.textContent.length > 0) {
      if (elData.status !== Status.InProgress) {
        elData.lastNodeIndex = i;
        elData.lastCharIndex = node.textContent.length - 1;
        return;
      }

      node.textContent = node.textContent.slice(0, -1);
      const ttw = getTimeToWait(opt);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, ttw);
      });
    }
  }
  elData.status = Status.Clear;
  elData.lastNodeIndex = 0;
  elData.lastCharIndex = 0;
}

function getTimeToWait(opt: Options) {
  if (!opt.deleteModifier) {
    return opt.timePerChar;
  }
  return opt.timePerChar * opt.deleteModifier;
}

import { Options, Status } from "../types.js";
import Typewriter from "../Typewriter";

export default async function deleteText(this: Typewriter, el: Element) {
  const data = this.elementsData.get(el);
  if (!data || data.status === Status.InProgress) {
    return;
  }

  data.status = Status.InProgress;
  const opt = this.getOptions(el);
  const { textNodesData, lastNodeIndex } = data;
  let i = lastNodeIndex;
  for (; i >= 0; i--) {
    const { node, text } = textNodesData[i];
    if (!text || text === "" || !node.textContent) {
      continue;
    }

    while (node.textContent && node.textContent.length > 0) {
      if (data.status !== Status.InProgress) {
        data.lastNodeIndex = i;
        data.lastCharIndex = node.textContent.length - 1;
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
  data.status = Status.Clear;
  data.lastNodeIndex = 0;
  data.lastCharIndex = 0;
}

function getTimeToWait(opt: Options) {
  if (!opt.deleteModifier) {
    return opt.timePerChar;
  }
  return opt.timePerChar * opt.deleteModifier;
}

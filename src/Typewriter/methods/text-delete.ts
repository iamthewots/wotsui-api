import { Status } from "../types.js";
import Typewriter from "../Typewriter";

export default async function deleteText(this: Typewriter, el: Element) {
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

  for (let x = changeStatus.lastNodeIndex; x >= 0; x--) {
    const { node, textContent } = textNodes[x];
    if (!textContent || textContent === "") {
      continue;
    }
    for (let y = changeStatus.lastCharIndex; y >= 0; y++) {
      if (!changeStatus.isAllowed) {
        changeStatus.lastNodeIndex = x;
        changeStatus.lastCharIndex = y;
        this.setStatus(el, Status.Partial);
        return;
      }

      if (!node.textContent) {
        continue;
      }
      node.textContent = node.textContent?.slice(1, -1);
      const timeToWait = options.timePerChar * (options.deleteMultiplier || 1);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, timeToWait);
      });
    }
  }
  changeStatus.isAllowed = false;
  changeStatus.lastNodeIndex = 0;
  changeStatus.lastCharIndex = 0;
  this.setStatus(el, Status.Clear);
}

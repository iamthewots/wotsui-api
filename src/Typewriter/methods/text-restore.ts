import { Status } from "../types.js";
import Typewriter from "../Typewriter.js";

export default function restoreText(this: Typewriter, el: Element) {
  const elData = this.elementsData.get(el);
  if (!elData) {
    return;
  }
  const { textNodesData } = elData;
  textNodesData.forEach((tnd) => {
    tnd.node.textContent = tnd.text;
  });
  elData.status = Status.Initial;
  elData.lastNodeIndex = textNodesData.length - 1;
  elData.lastCharIndex = textNodesData[textNodesData.length - 1].length - 1;
}

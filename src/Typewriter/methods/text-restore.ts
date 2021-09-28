import { Status } from "../types.js";
import Typewriter from "../Typewriter.js";

export default function restoreText(this: Typewriter, el: Element) {
  const data = this.elementsData.get(el);
  if (!data) {
    return;
  }
  const { textNodesData } = data;
  textNodesData.forEach((tnd) => {
    tnd.node.textContent = tnd.text;
  });
  data.status = Status.Initial;
  data.lastNodeIndex = textNodesData.length - 1;
  data.lastCharIndex = textNodesData[textNodesData.length - 1].length - 1;
}

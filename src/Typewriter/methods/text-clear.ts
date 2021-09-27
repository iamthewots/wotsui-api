import { Status } from "../types.js";
import Typewriter from "../Typewriter.js";

export default function clearText(this: Typewriter, el: Element) {
  const elData = this.elementsData.get(el);
  if (!elData) {
    return;
  }
  const { textNodesData } = elData;
  textNodesData.forEach(tnd => {
    tnd.node.textContent = "";
  });
  elData.status = Status.Clear;
  elData.lastNodeIndex = 0;
  elData.lastCharIndex = 0;
}
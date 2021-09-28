import { Status } from "../types.js";
import Typewriter from "../Typewriter.js";

export default function clearText(this: Typewriter, el: Element) {
  const data = this.elementsData.get(el);
  if (!data) {
    return;
  }
  const { textNodesData } = data;
  textNodesData.forEach(tnd => {
    tnd.node.textContent = "";
  });
  data.status = Status.Clear;
  data.lastNodeIndex = 0;
  data.lastCharIndex = 0;
}
import { Status } from "../types.js";
import Typewriter from "../Typewriter";

export default function restoreText(this: Typewriter, el: Element) {
  const data = this.elementsData.get(el);
  if (!data) {
    return;
  }

  data.textNodes.forEach((tn) => {
    tn.node.textContent = tn.textContent;
  });
  this.setStatus(el, Status.Initial);
}

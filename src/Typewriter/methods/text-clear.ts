import { Status } from "../types.js";
import Typewriter from "../Typewriter";

export default function clearText(
  this: Typewriter,
  el: Element,
  updateBeforeClear?: boolean
) {
  const textNodes = this.getElementTextNodes(el, true);
  this.setStatus(el, Status.Clear);
  if (updateBeforeClear) {
    const data = this.elementsData.get(el);
    if (!data) {
      return;
    }
    this.elementsData.set(el, { ...data, textNodes });
  }
}

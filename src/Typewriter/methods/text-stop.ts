import { Status } from "../types.js";
import Typewriter from "../Typewriter";

export default function stopText(this: Typewriter, el: Element) {
  const elData = this.elementsData.get(el);
  if (!elData || elData.status !== Status.InProgress) {
    return;
  }

  elData.status = Status.Partial;
}

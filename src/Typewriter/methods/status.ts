import { Status } from "../types.js";
import Typewriter from "../Typewriter";

export function getStatus(this: Typewriter, el: Element) {
  const data = this.elementsData.get(el);
  if (!data) {
    return -1;
  }
  return data.status;
}

export function setStatus(this: Typewriter, el: Element, status: Status) {
  const data = this.elementsData.get(el);
  if (!data || !Object.values(Status).includes(status)) {
    return;
  }
  data.status = status;
  const eName =
    status === Status.Clear
      ? "clearedtext"
      : status === Status.Active
      ? "changingtext"
      : "restoredtext";
  const e = new CustomEvent(eName);
  el.dispatchEvent(e);
}

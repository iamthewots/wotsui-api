import IntersectionManager from "../index";
import { Options } from "../types";

export default function unobserve(this: IntersectionManager, el: Element) {
  const opt = this.getOptions(el);
  const obs = this.observersList.get(opt.threshold);
  if (obs) {
    obs.unobserve(el);
  }
  this.optionsList.delete(el);
}

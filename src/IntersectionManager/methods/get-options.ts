import IntersectionManager from "../index";
import { Options } from "../types";

export default function getOptions(this: IntersectionManager, el: Element) {
  if (el) {
    const opt = this.optionsList.get(el);
    if (opt) {
      return { ...this.options, ...opt };
    }
  }
  return this.options;
}

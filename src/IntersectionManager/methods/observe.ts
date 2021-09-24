import IntersectionManager from "../index";
import { Options } from "../types";

export default function observe(
  this: IntersectionManager,
  el: Element,
  options?: Options
) {
  let opt = this.options;
  if (options) {
    opt = this.parseOptions(options);
  }
  const thr = opt.threshold || 1;
  const obs = this.getObserver(thr);
  obs.observe(el);
  this.optionsList.set(el, opt);
}

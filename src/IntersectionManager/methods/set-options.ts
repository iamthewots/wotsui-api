import IntersectionManager from "../index";
import { Options } from "../types";

export default function updateOptions(
  this: IntersectionManager,
  options: Options,
  el?: Element
) {
  const opt = this.parseOptions(options);
  if (el) {
    const elOpt = this.getOptions(el);
    const diffThr = options.threshold && options.threshold !== elOpt.threshold;
    if (diffThr) {
      const obs = this.getObserver(elOpt.threshold);
      obs.unobserve(el);
    }
    const newOpt = { ...elOpt, ...this.parseOptions(options) };
    if (diffThr) {
      this.observe(el, newOpt);
    } else {
      this.optionsList.set(el, newOpt);
    }
    return newOpt;
  }
  this.options = { ...this.options, ...opt };
  return this.options;
}

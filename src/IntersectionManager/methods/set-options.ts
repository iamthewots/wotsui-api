import IntersectionManager from "../index";
import { Options } from "../types";

export default function updateOptions(
  this: IntersectionManager,
  options: Options,
  el?: Element
) {
  const opt = this.parseOptions(options);
  if (!el) {
    this.options = { ...this.options, ...opt };
    return this.options;
  }

  const elOpt = this.getOptions(el);
  const isThresholdDifferent =
    opt.threshold && opt.threshold !== elOpt.threshold;
  const newOpt = { ...elOpt, ...opt };
  if (isThresholdDifferent) {
    const obs = this.getObserver(elOpt.threshold);
    obs.unobserve(el);
    this.observe(el, newOpt);
  } else {
    this.optionsList.set(el, newOpt);
  }
  return newOpt;
}

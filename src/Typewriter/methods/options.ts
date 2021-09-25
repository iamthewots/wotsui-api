import { Options } from "../types.js";
import Typewriter from "../Typewriter.js";

export function parseOptions(obj: { [prop: string]: any } | Options) {
  const opt: Options = {
    timePerChar: 25,
  };
  if (typeof obj !== "object") {
    return opt;
  }

  opt.ignorePunctuation = !!obj.ignorePunctuation;
  if (typeof obj.timePerChar === "number") {
    opt.timePerChar = obj.timePerChar;
  }
  if (typeof obj.deleteMultiplier === "number") {
    opt.deleteMultiplier = obj.deleteMultiplier;
  } else {
    opt.deleteMultiplier = opt.timePerChar;
  }
  return opt;
}

export function getOptions(this: Typewriter, el?: Element) {
  if (el) {
    const data = this.elementsData.get(el);
    if (!data || !data.options) {
      return this.options;
    }
    return { ...this.options, ...data.options };
  }
  return this.options;
}

export function setOptions(
  this: Typewriter,
  options: { [prop: string]: any } | Options,
  el?: Element
) {
  const opt = this.parseOptions(options);
  if (el) {
    const data = this.elementsData.get(el);
    if (data) {
      const newElementOpt = { ...data.options, ...opt };
      this.elementsData.set(el, { ...data, options: newElementOpt });
      return newElementOpt;
    }
  }
  const newOpt = { ...this.options, ...opt };
  this.options = newOpt;
  return this.options;
}

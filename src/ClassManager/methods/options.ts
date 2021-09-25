import ClassManager from "../ClassManager.js";
import { Options, Target } from "../types.js";

export function parseOptions(obj: { [prop: string]: any } | Options) {
  const opt: Options = {
    target: Target.Self,
  };
  if (typeof obj !== "object") {
    return opt;
  }
  opt.queue = !!obj.queue;
  opt.invert = !!obj.invert;
  opt.invertAdd = !!obj.invertAdd;
  opt.invertRemove = !!obj.invertRemove;
  opt.reactive = !!obj.reactive;
  opt.ignoreIntervalOnAdd = !!obj.ignoreIntervalOnAdd;
  opt.ignoreIntervalOnRemove = !!obj.ignoreIntervalOnRemove;
  if (Object.values(Target).includes(obj.target)) {
    opt.target = obj.target;
  }
  if (typeof obj.interval === "number") {
    opt.interval = obj.interval;
  }
  if (Array.isArray(obj.interval)) {
    opt.interval = obj.interval.filter((val) => {
      return typeof val === "number";
    });
  }
  return opt;
}

export function getOptions(this: ClassManager) {
  return this.options;
}

export function setOptions(
  this: ClassManager,
  options: Options | { [prop: string]: any }
) {
  const opt = this.parseOptions(options);
  this.options = { ...this.options, ...opt };
  return this.options;
}

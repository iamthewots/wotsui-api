import { Options, Target } from "../types.js";

export default function parseOptions(obj: { [prop: string]: any }) {
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
  if (obj.target === Target.Self || obj.target === Target.Children) {
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

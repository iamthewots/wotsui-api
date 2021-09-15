import { Options } from "../types";

export default function parseOptions(obj: Options) {
  const opt: Options = {
    target: "self",
  };
  if (typeof obj !== "object") {
    return opt;
  }

  opt.queue = !!obj.queue;
  if (typeof obj.target === "string") {
    if (obj.target === "self" || obj.target === "children") {
      opt.target = obj.target;
    }
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

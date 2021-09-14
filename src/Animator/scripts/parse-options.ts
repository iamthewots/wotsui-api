import { Options, Target } from "../types";

export default function parseOptions(obj: Options) {
  const opt: Options = {
    target: Target.Self,
  };

  if (typeof obj !== "object") {
    return opt;
  }

  opt.queue = !!obj.queue;
  if (typeof obj.interval === "number") {
    opt.interval = obj.interval;
  }
  if (typeof obj.interval === "string") {
    opt.interval = parseFloat(obj.interval) * 1000;
  }
  if (
    typeof obj.adaptDelay === "number" ||
    typeof obj.adaptDelay === "string"
  ) {
    opt.adaptDelay = obj.adaptDelay;
  }
  if (
    typeof obj.adaptDuration === "number" ||
    typeof obj.adaptDuration === "string"
  ) {
    opt.adaptDuration = obj.adaptDuration;
  }
  return opt;
}

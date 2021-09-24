import { Options } from "../types";

export default function getTimeToWait(i: number, opt: Options) {
  if (typeof opt.interval === "number") {
    return opt.interval * i;
  }
  if (Array.isArray(opt.interval) && opt.interval.length > 0) {
    if (i >= 0 && i < opt.interval.length) {
      return opt.interval[i];
    }
    const lastIndex = opt.interval.length - 1;
    return opt.interval[lastIndex] * (i - lastIndex + 1);
  }
  return 0;
}

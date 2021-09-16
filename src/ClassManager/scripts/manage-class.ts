import { TimeoutsMap, Options } from "../types";
import parseOptions from "./parse-options.js";

export default function manageClass(
  el: Element,
  className: string,
  method: "add" | "remove",
  options: Options
) {
  if (
    !(el instanceof Element) ||
    typeof className !== "string" ||
    className === ""
  ) {
    return;
  }

  const fn = method === "add" ? "add" : "remove";
  const opt = parseOptions(options);
  const tims: number[] = [];

  if (opt.target === "self") {
    el.classList[fn](className);
  }

  if (opt.target === "children") {
    const { children } = el;
    if (!children || children.length === 0) {
      return;
    }

    for (let i = 0; i < children.length; i++) {
      const index = getIndex(i, children.length, fn, opt);
      const child = children.item(index);
      if (!child) {
        continue;
      }

      if (!opt.queue) {
        child.classList[fn](className);
        continue;
      }

      // queue
      const ttw = getTimeToWait(i, opt);
      const tim = setTimeout(() => {
        if (child) {
          child.classList[fn](className);
        }
      }, ttw);
      tims.push(tim);
    }
  }
  return tims;
}

function getIndex(i: number, length: number, fn: string, opt: Options) {
  return opt.invert ||
    (opt.invertAdd && fn === "add") ||
    (opt.invertRemove && fn === "remove")
    ? length - 1 - i
    : i;
}

function getTimeToWait(i: number, opt: Options) {
  if (typeof opt.interval === "number") {
    return opt.interval * i;
  }
  if (Array.isArray(opt.interval)) {
    if (opt.interval.length === 0) {
      return 0;
    }
    if (opt.interval[i] === undefined) {
      const lastIndex = opt.interval.length - 1;
      return opt.interval[lastIndex] * (i - lastIndex + 1);
    }
    return opt.interval[i];
  }
  return 0;
}

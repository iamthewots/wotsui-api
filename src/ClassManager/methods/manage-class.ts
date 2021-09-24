import ClassManager from "../index.js";
import { Method, Options, Target } from "../types.js";
import getTimeToWait from "../helpers/get-time-to-wait.js";
import isElementSkipped from "../helpers/is-element-skipped.js";
import isIntervalIgnored from "../helpers/is-interval-ignored.js";

export default function manageClass(
  this: ClassManager,
  method: Method,
  className: string,
  options?: Options
) {
  if (typeof className !== "string" || className === "") {
    return;
  }

  this.clearClassTimeouts(className);
  const classMethod = method === Method.Add ? "add" : "remove";
  const opt = options
    ? { ...this.options, ...this.parseOptions(options) }
    : this.options;
  if (opt.target === Target.Self) {
    this.el.classList[classMethod](className);
    this.emitEvent(this.el, method, className);
  }
  const timeouts: number[] = [];

  if (opt.target === Target.Children) {
    const { children } = this.el;
    if (!children || children.length === 0) {
      return;
    }

    const intervalIsIgnored = isIntervalIgnored(method, opt);
    let longerTTW = 0;
    let lastChild: Element;
    for (let i = 0; i < children.length; i++) {
      const index = getElementIndex(i, children.length, method, opt);
      const child = children.item(index);
      if (!child) {
        continue;
      }
      lastChild = child;
      if (isElementSkipped(child, className, method, opt)) {
        continue;
      }
      if (!opt.queue || intervalIsIgnored) {
        child.classList[classMethod](className);
        continue;
      }

      const timeToWait = getTimeToWait(i, opt);
      if (timeToWait > longerTTW) longerTTW = timeToWait;
      const timeout = setTimeout(() => {
        if (!child) {
          return;
        }
        child.classList[classMethod](className);
      }, timeToWait);
      timeouts.push(timeout);
    }
    const eta = intervalIsIgnored ? 0 : longerTTW;
    const timeout = setTimeout(() => {
      this.emitEvent(lastChild, method, className);
    }, eta);
    timeouts.push(timeout);
  }
  if (timeouts.length > 0) {
    this.classTimeouts.set(className, timeouts);
  }
}

// helper methods
function getElementIndex(
  i: number,
  length: number,
  method: Method,
  opt: Options
) {
  const invertedIndex = length - 1 - i;
  if (opt.invert) {
    return invertedIndex;
  }
  if (opt.invertAdd && method === Method.Add) {
    return invertedIndex;
  }
  if (opt.invertRemove && method === Method.Remove) {
    return invertedIndex;
  }
  return i;
}

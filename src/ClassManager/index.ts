import { Options, Target, Method } from "./types.js";

export default class ClassManager {
  _el: Element;
  _options: Options;
  _class_timeouts: Map<string, number[]>;

  constructor(el: Element, options: Options) {
    this._el = el;
    this._options = this.parseOptions(options);
    this._class_timeouts = new Map();
  }

  parseOptions(obj: { [prop: string]: any }) {
    return ClassManager.parseOptions(obj);
  }

  static parseOptions(obj: { [prop: string]: any }) {
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

  add(className: string, options?: Options) {
    this.manageClass(Method.Add, className, options);
  }

  remove(className: string, options?: Options) {
    this.manageClass(Method.Remove, className, options);
  }

  private manageClass(method: Method, className: string, options?: Options) {
    if (typeof className !== "string" || className === "") {
      return;
    }
    this.clearClassTimeouts(className);
    const clFn = method === Method.Add ? "add" : "remove";
    let opt = this._options;
    if (options) {
      opt = { ...this._options, ...this.parseOptions(options) };
    }
    const tims: number[] = [];
    if (opt.target === Target.Self) {
      this._el.classList[clFn](className);
      this.emitEvent(this._el, method, className);
    }
    if (opt.target === Target.Children) {
      const { children } = this._el;
      if (!children || children.length === 0) {
        return;
      }

      const ignoreInterval = this.shouldIgnoreInterval(method, opt);
      let longerTtw = 0;
      let lastChild: Element;
      for (let i = 0; i < children.length; i++) {
        const ci = this.getChildIndex(i, children.length, method, opt);
        const child = children.item(ci);
        if (!child) {
          continue;
        }
        lastChild = child;
        if (this.canBeSkipped(child, className, method, opt)) {
          continue;
        }
        if (!opt.queue || ignoreInterval) {
          child.classList[clFn](className);
          continue;
        }

        const ttw = this.getTimeToWait(i, opt);
        if (ttw > longerTtw) {
          longerTtw = ttw;
        }
        const tim = setTimeout(() => {
          if (child) {
            child.classList[clFn](className);
          }
        }, ttw);
        tims.push(tim);
      }
      const eta = ignoreInterval ? 0 : longerTtw;
      const tim = setTimeout(() => {
        this.emitEvent(lastChild, method, className);
      }, eta);
      tims.push(tim);
    }
    if (tims.length > 0) {
      this._class_timeouts.set(className, tims);
    }
  }

  clearClassTimeouts(className: string) {
    const tims = this._class_timeouts.get(className);
    if (tims && tims.length > 0) {
      for (const tim of tims) {
        clearTimeout(tim);
      }
    }
  }

  private emitEvent(target: Element, method: Method, className: string) {
    const eName = method === Method.Add ? "classadded" : "classremoved";
    const e = new CustomEvent(eName, {
      detail: {
        className,
        target,
      },
    });
    this._el.dispatchEvent(e);
  }

  private getChildIndex(
    i: number,
    length: number,
    method: Method,
    opt: Options
  ) {
    if (
      opt.interval ||
      (opt.invertAdd && method === Method.Add) ||
      (opt.invertRemove && method === Method.Remove)
    ) {
      return length - 1 - i;
    }
    return i;
  }

  private canBeSkipped(
    el: Element,
    className: string,
    method: Method,
    opt: Options
  ) {
    if (!opt.reactive) {
      return false;
    }
    const isClassApplied = el.classList.contains(className);
    if (
      (isClassApplied && method === Method.Add) ||
      (!isClassApplied && method === Method.Remove)
    ) {
      return true;
    }
    return false;
  }

  private shouldIgnoreInterval(method: Method, opt: Options) {
    if (
      (opt.ignoreIntervalOnAdd && method === Method.Add) ||
      (opt.ignoreIntervalOnRemove && method === Method.Remove)
    ) {
      return true;
    }
    return false;
  }

  private getTimeToWait(i: number, opt: Options) {
    if (typeof opt.interval === "number") {
      return opt.interval * i;
    }
    if (Array.isArray(opt.interval) && opt.interval.length > 0) {
      if (typeof opt.interval[i] !== "undefined") {
        return opt.interval[i];
      }
      const lastIndex = opt.interval.length - 1;
      return opt.interval[lastIndex] * (i - lastIndex + 1);
    }
    return 0;
  }
}

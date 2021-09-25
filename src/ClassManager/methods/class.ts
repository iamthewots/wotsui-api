import ClassManager from "../ClassManager";
import { Method, Options, Target } from "../types.js";

export function add(this: ClassManager, className: string, options?: Options) {
  this.manageClass(Method.Add, className, options);
}

export function remove(
  this: ClassManager,
  className: string,
  options?: Options
) {
  this.manageClass(Method.Remove, className, options);
}

export function clearClassTimeouts(this: ClassManager, className: string) {
  const timeouts = this.classTimeouts.get(className);
  if (timeouts && timeouts.length > 0) {
    for (const timeout of timeouts) {
      clearTimeout(timeout);
    }
  }
}

export function manageClass(
  this: ClassManager,
  method: Method,
  className: string,
  options?: Options
) {
  if (typeof className !== "string") {
    return;
  }

  this.clearClassTimeouts(className);
  const opt = options
    ? { ...this.options, ...this.parseOptions(options) }
    : this.options;
  const data = {
    method,
    className,
    opt,
  };
  if (opt.target === Target.Self) {
    this.manageSelfClass(data);
  }
  if (opt.target === Target.Children) {
    this.manageChildrenClass(data);
  }
}

interface ManageClassData {
  method: Method;
  className: string;
  opt: Options;
}

export function manageSelfClass(this: ClassManager, data: ManageClassData) {
  const { method, className } = data;
  const classMethod = method === Method.Add ? "add" : "remove";
  this.el.classList[classMethod](className);
  this.emitEvent(this.el, method, className);
}

export function manageChildrenClass(this: ClassManager, data: ManageClassData) {
  const { method, className, opt } = data;
  const classMethod = method === Method.Add ? "add" : "remove";
  const { children } = this.el;
  if (!children || children.length === 0) {
    return;
  }

  const classTimeouts: number[] = [];
  let higherTTW = 0;
  let lastChild: Element;
  for (let i = 0; i < children.length; i++) {
    const invertedIndex = children.length - 1 - i;
    const relativeIndex =
      opt.invert ||
      (opt.invertAdd && method === Method.Add) ||
      (opt.invertAdd && method === Method.Remove)
        ? invertedIndex
        : i;
    const child = children.item(relativeIndex);
    if (!child) {
      continue;
    }
    lastChild = child;
    const skipChild = shouldSkipChild(child, className, method, opt);
    if (skipChild) {
      continue;
    }
    const ignoreInterval = shouldIgnoreInterval(method, opt);
    if (!opt.queue || ignoreInterval) {
      child.classList[classMethod](className);
      continue;
    }
    const timeToWait = getTimeToWait(i, opt);
    if (timeToWait > higherTTW) {
      higherTTW = timeToWait;
    }
    const timeout = setTimeout(() => {
      if (!child) {
        return;
      }
      child.classList[classMethod](className);
    }, timeToWait);
    classTimeouts.push(timeout);
  }
  if (classTimeouts.length > 0) {
    this.classTimeouts.set(className, classTimeouts);
  }
}

function shouldSkipChild(
  child: Element,
  className: string,
  method: Method,
  opt: Options
) {
  if (!opt.reactive) {
    return false;
  }
  const classAlreadyApplied = child.classList.contains(className);
  if (classAlreadyApplied && method === Method.Add) {
    return true;
  }
  if (!classAlreadyApplied && method === Method.Remove) {
    return true;
  }
  return false;
}

function shouldIgnoreInterval(method: Method, opt: Options) {
  if (opt.ignoreIntervalOnAdd && method === Method.Add) {
    return true;
  }
  if (opt.ignoreIntervalOnRemove && method === Method.Remove) {
    return true;
  }
  return false;
}

function getTimeToWait(i: number, opt: Options) {
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

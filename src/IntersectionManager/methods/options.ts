import IntersectionManager from "../IntersectionManager";
import { Options } from "../types";

export function parseOptions(obj: { [prop: string]: any } | Options) {
  const opt: Options = {
    threshold: 1,
  };
  if (typeof obj !== "object") {
    return opt;
  }

  opt.observeOnce = !!obj.observeOnce;
  opt.toggleOpacity = !!obj.toggleOpacity;
  if (typeof obj.threshold === "number") {
    opt.threshold = Math.min(Math.max(obj.threshold, 0), 1);
  }
  if (typeof obj.intersectionClass === "string") {
    opt.intersectionClass = obj.intersectionClass;
  }
  if (typeof obj.noIntersectionClass === "string") {
    opt.noIntersectionClass = obj.noIntersectionClass;
  }
  if (typeof obj.intersectionHandler === "function") {
    opt.intersectionHandler = obj.intersectionHandler;
  }
  if (typeof obj.noIntersectionHandler === "function") {
    opt.noIntersectionHandler = obj.noIntersectionHandler;
  }
  return opt;
}

export function getOptions(this: IntersectionManager, el: Element) {
  if (el) {
    const opt = this.optionsList.get(el);
    if (opt) {
      return { ...this.options, ...opt };
    }
  }
  return this.options;
}

export function setOptions(
  this: IntersectionManager,
  options: { [prop: string]: any } | Options,
  el?: Element
) {
  if (typeof options !== "object" || (el && !this.optionsList.get(el))) {
    return;
  }

  const opt = this.parseOptions(options);
  if (!el) {
    this.options = { ...this.options, ...opt };
    return this.options;
  }

  const elementOpt = this.getOptions(el);
  const newElementOpt = { ...elementOpt, ...opt };
  const thresholdHasChanged = options.threshold !== elementOpt.threshold;
  if (thresholdHasChanged) {
    const obs = this.getObserver(elementOpt.threshold);
    if (obs) {
      obs.unobserve(el);
    }
    this.observe(el, newElementOpt);
  } else {
    this.optionsList.set(el, newElementOpt);
  }
  return newElementOpt;
}

export function applyOptions(
  this: IntersectionManager,
  entry: IntersectionObserverEntry
) {
  const el = entry.target;
  const opt = this.getOptions(el);
  if (opt.toggleOpacity && el instanceof HTMLElement) {
    el.style.opacity = entry.isIntersecting ? "initial" : "0";
  }
  const classToAdd = entry.isIntersecting
    ? opt.intersectionClass
    : opt.noIntersectionClass;
  const classToRemove = entry.isIntersecting
    ? opt.noIntersectionClass
    : opt.intersectionClass;
  if (classToAdd) el.classList.add(classToAdd);
  if (classToRemove) el.classList.remove(classToRemove);
  return opt;
}

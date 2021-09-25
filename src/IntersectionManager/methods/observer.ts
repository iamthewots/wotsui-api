import { Options } from "../types";
import IntersectionManager from "../IntersectionManager";

export function getObserver(this: IntersectionManager, threshold: number) {
  if (typeof threshold !== "number") {
    throw new Error("Invalid threshold");
  }
  const thr = Math.min(Math.max(threshold, 0), 1);
  const obs = this.observersList.get(thr);
  if (obs) {
    return obs;
  }

  const newObs = new IntersectionObserver(this.observerCallback.bind(this), {
    threshold: thr,
  });
  return newObs;
}

export function observerCallback(
  this: IntersectionManager,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) {
  entries.forEach((entry) => {
    const opt = this.applyOptions(entry);
    const el = entry.target;
    if (entry.isIntersecting) {
      if (opt.intersectionHandler) {
        opt.intersectionHandler(entry);
      }
      if (opt.observeOnce) {
        observer.unobserve(el);
      }
    } else if (opt.noIntersectionHandler) {
      opt.noIntersectionHandler(entry);
    }
  });
}

export function observe(
  this: IntersectionManager,
  el: Element,
  options?: Options
) {
  if (!(el instanceof Element)) {
    return;
  }
  const opt = options ? this.parseOptions(options) : this.options;
  const obs = this.getObserver(opt.threshold);
  obs.observe(el);
  this.optionsList.set(el, opt);
}

export function unobserve(this: IntersectionManager, el: Element) {
  const opt = this.getOptions(el);
  const obs = this.observersList.get(opt.threshold);
  if (obs) {
    obs.unobserve(el);
  }
  this.optionsList.delete(el);
}

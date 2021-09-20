import { Options } from "./types";

export default class IntersectionManager {
  _default_options: Options;
  _options_list: Map<Element, Options>;
  _observers_list: Map<number, IntersectionObserver>;

  constructor(options: Options) {
    this._default_options = this.parseOptions(options);
    this._observers_list = new Map();
    this._options_list = new Map();
  }

  parseOptions(obj: { [prop: string]: any }) {
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

  observe(el: Element, options?: Options) {
    let opt = this._default_options;
    if (options) {
      opt = this.parseOptions(options);
    }
    const thr = opt.threshold || 1;
    const obs = this.getObserver(thr);
    obs.observe(el);
    this._options_list.set(el, opt);
  }

  unobserve(el: Element) {
    const opt = this.getOptions(el);
    const obs = this._observers_list.get(opt.threshold);
    if (obs) {
      obs.unobserve(el);
    }
    this._options_list.delete(el);
  }

  private getObserver(threshold: number) {
    const thr = Math.min(Math.max(threshold, 0), 1);
    let obs = this._observers_list.get(thr);
    if (obs) {
      return obs;
    }
    obs = new IntersectionObserver(
      (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        entries.forEach((entry) => {
          this.emitEvent(entry);
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
      },
      {
        threshold: thr,
      }
    );
    return obs;
  }

  private emitEvent(entry: IntersectionObserverEntry) {
    const el = entry.target;
    const eName = entry.isIntersecting ? "intersection" : "nointersection";
    const e = new CustomEvent(eName, {
      detail: entry,
    });
    el.dispatchEvent(e);
  }

  private applyOptions(entry: IntersectionObserverEntry) {
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

  private getOptions(el: Element) {
    if (el) {
      const opt = this._options_list.get(el);
      if (opt) {
        return { ...this._default_options, ...opt };
      }
    }
    return this._default_options;
  }

  updateOptions(el: Element, options: Options) {
    const opt = this.getOptions(el);
    const diffThr = options.threshold && options.threshold !== opt.threshold;
    if (diffThr) {
      const obs = this.getObserver(opt.threshold);
      obs.unobserve(el);
    }
    const newOpt = this.parseOptions(options);
    if (diffThr) {
      this.observe(el, newOpt);
    } else {
      this._options_list.set(el, newOpt);
    }
  }
}

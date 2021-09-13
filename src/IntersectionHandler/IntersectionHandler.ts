import applyOptions from "./scripts/apply-options.js";
import parseOptions from "./scripts/parse-options.js";

export interface IntersectionHandlerOptions {
  observeOnce?: boolean;
  toggleOpacity?: boolean;
  intersectionClass?: string;
  noIntersectionClass?: string;
  intersectionHandler?: (entry: IntersectionObserverEntry) => any;
  noIntersectionHandler?: (entry: IntersectionObserverEntry) => any;
}

export type Options = { [prop: string]: any } | IntersectionHandlerOptions;

export default class IntersectionHandler {
  _observer: IntersectionObserver;
  _default_options: IntersectionHandlerOptions;
  _options_list: Map<Element, IntersectionHandlerOptions>;

  constructor(threshold = 0, options: Options) {
    this._observer = new IntersectionObserver(
      this.observerCallback.bind(this),
      {
        threshold,
      }
    );
    this._default_options = parseOptions(options);
    this._options_list = new Map();
  }

  observerCallback(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      const el = entry.target;
      const e = new CustomEvent(
        entry.isIntersecting ? "intersection" : "nointersection"
      );
      el.dispatchEvent(e);

      const opt = this.getOptions(el);
      applyOptions(el, opt, entry.isIntersecting);
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

  observe(el: Element, options?: Options) {
    this._observer.observe(el);
    if (!options) {
      return;
    }
    if (options) {
      const opt = parseOptions(options);
      this._options_list.set(el, opt);
    }
  }

  getOptions(el?: Element) {
    if (el) {
      const opt = this._options_list.get(el);
      if (opt) {
        return { ...this._default_options, ...opt };
      }
    }
    return this._default_options;
  }

  setOptions(options: { [prop: string]: any }, el?: Element) {
    const opt = parseOptions(options);
    if (el) {
      this._options_list.set(el, opt);
    } else {
      this._default_options = { ...this._default_options, ...opt };
    }
  }
}

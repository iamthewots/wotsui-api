interface IntersectionHandlerOptions {
  observeOnce?: boolean;
  toggleOpacity?: boolean;
  intersectionClass?: string;
  noIntersectionClass?: string;
  intersectionHandler?: (entry: IntersectionObserverEntry) => any;
  noIntersectionHandler?: (entry: IntersectionObserverEntry) => any;
}

export default class IntersectionHandler {
  _observer: IntersectionObserver;
  _default_options: IntersectionHandlerOptions;
  _options_list: Map<Element, IntersectionHandlerOptions>;

  constructor(threshold = 0, options: { [props: string]: any }) {
    this._observer = new IntersectionObserver(
      this.observerCallback.bind(this),
      {
        threshold,
      }
    );
    this._default_options = this.parseOptions(options);
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

      const opt = this._options_list.get(el) || this._default_options;
      this.applyOptions(el, opt, entry.isIntersecting);
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

  applyOptions(
    el: Element,
    options: IntersectionHandlerOptions,
    isIntersecting: boolean
  ) {
    if (!el || !options) {
      return;
    }
    if (options.toggleOpacity && el instanceof HTMLElement) {
      el.style.opacity = isIntersecting ? "initial" : "0";
    }
    const classToAdd = isIntersecting
      ? options.intersectionClass
      : options.noIntersectionClass;
    const classToRemove = isIntersecting
      ? options.noIntersectionClass
      : options.intersectionClass;
    if (classToAdd) {
      el.classList.add(classToAdd);
    }
    if (classToRemove) {
      el.classList.remove(classToRemove);
    }
  }

  parseOptions(obj: { [prop: string]: any }): IntersectionHandlerOptions {
    const opt: IntersectionHandlerOptions = {};
    if (!obj) {
      return opt;
    }

    opt.observeOnce = !!obj.observeOnce;
    opt.toggleOpacity = !!obj.toggleOpacity;
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

  observe(el: Element, options?: { [prop: string]: any }, merge?: boolean) {
    this._observer.observe(el);
    if (!options) {
      return;
    }

    const opt = this.parseOptions(options);
    if (merge) {
      this._options_list.set(el, { ...this._default_options, ...opt });
    } else {
      this._options_list.set(el, opt);
    }
  }

  getOptions(el?: Element) {
    if (el) {
      return this._options_list.get(el);
    }
    return this._default_options;
  }

  setOptions(options: { [prop: string]: any }, merge?: boolean, el?: Element) {
    const opt = this.parseOptions(options);
    if (el) {
      if (merge) {
        const baseOpt = this._options_list.get(el) || this._default_options;
        this._options_list.set(el, { ...baseOpt, ...opt });
      } else {
        this._options_list.set(el, opt);
      }
    } else {
      if (merge) {
        Object.assign(this._default_options, opt);
      } else {
        this._default_options = opt;
      }
    }
  }
}

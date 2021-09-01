interface IntersectionHandlerOptions {
  observeOnce?: boolean;
  toggleOpacity?: boolean;
  intersectionClass?: string;
  noIntersectionClass?: string;
  onIntersection?: (entry: IntersectionObserverEntry) => any;
  onNoIntersection?: (entry: IntersectionObserverEntry) => any;
}

export default class IntersectionHandler {
  _observer: IntersectionObserver;
  _mainOptions: IntersectionHandlerOptions;
  _options: Map<Element | number, IntersectionHandlerOptions>;

  constructor(threshold = 0.2, options: IntersectionHandlerOptions = {}) {
    this._observer = new IntersectionObserver(
      this.observerCallback.bind(this),
      {
        threshold,
      }
    );
    this._mainOptions = this.parseOptions(options);
    this._options = new Map();
  }

  parseOptions(obj: { [prop: string]: any }): IntersectionHandlerOptions {
    const options: IntersectionHandlerOptions = {};
    if (typeof obj !== "object") {
      return options;
    }

    options.observeOnce = !!obj.observeOnce;
    options.toggleOpacity = !!obj.toggleOpacity;
    if (typeof obj.intersectionClass === "string") {
      options.intersectionClass = obj.intersectionClass;
    }
    if (typeof obj.noIntersectionClass === "string") {
      options.noIntersectionClass = obj.noIntersectionClass;
    }
    if (typeof obj.onIntersection === "function") {
      options.onIntersection = obj.onIntersection;
    }
    if (typeof obj.onNoIntersection === "function") {
      options.onNoIntersection = obj.onNoIntersection;
    }

    return options;
  }

  mergeOptions(options: IntersectionHandlerOptions, el?: Element) {
    if (el) {
      const elOptions = this._options.get(el);
      if (elOptions) {
        return { ...elOptions, options };
      } else {
        return options;
      }
    }
    return { ...this._mainOptions, ...options };
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
      const options = this._options.get(el) || this._mainOptions;
      this.applyOptions(el, options, entry.isIntersecting);

      if (entry.isIntersecting) {
        if (options.onIntersection) {
          options.onIntersection(entry);
          if (options.observeOnce) {
            observer.unobserve(el);
          }
        }
      }

      if (!entry.isIntersecting) {
        if (options.onNoIntersection) {
          options.onNoIntersection(entry);
        }
      }
    });
  }

  applyOptions(
    el: Element,
    options: IntersectionHandlerOptions,
    isIntersecting: boolean
  ) {
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
      el.classList.add(classToRemove);
    }
  }

  observe(
    el: Element,
    options?: { [prop: string]: any },
    mergeOptions?: boolean
  ) {
    this._observer.observe(el);
  }

  getOptions(el?: Element) {
    return el ? this._options.get(el) : this._mainOptions;
  }
}

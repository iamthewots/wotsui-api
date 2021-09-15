import { TimeoutsMap, Options } from "./types";
import parseOptions from "./scripts/parse-options.js";
import manageClass from "./scripts/manage-class.js";

export default class ClassManager {
  _el: Element;
  _default_options: Options;
  _timeouts: TimeoutsMap;
  constructor(el: Element, options: Options) {
    this._el = el;
    this._default_options = parseOptions(options);
    this._timeouts = new Map();
  }

  add(className: string, options?: Options) {
    this.manage("add", className, options);
  }

  remove(className: string, options?: Options) {
    this.manage("remove", className, options);
  }

  manage(method: "add" | "remove", className: string, options?: Options) {
    if (typeof className !== "string" || className === "") {
      return;
    }
    this.clearClassTimeouts(className);
    const opt = options
      ? { ...this._default_options, ...parseOptions(options) }
      : this._default_options;
    const ints = manageClass(this._el, className, method, opt);
    if (ints) {
      this._timeouts.set(className, ints);
    }
  }

  clearClassTimeouts(className: string) {
    const ints = this._timeouts.get(className);
    if (ints && ints.length > 0) {
      for (const int of ints) {
        clearInterval(int);
      }
    }
  }

  static parseOptions(options: Options) {
    return parseOptions(options);
  }
}

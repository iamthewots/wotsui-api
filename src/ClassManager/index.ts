import { Method, Options } from "./types.js";
import clearClassTimeouts from "./methods/clear-timeouts.js";
import emitEvent from "./methods/emit-events.js";
import manageClass from "./methods/manage-class.js";
import parseOptions from "./methods/parse-options.js";
import updateOptions from "./methods/update-options.js";

export default class ClassManager {
  protected el: Element;
  protected options: Options;
  protected classTimeouts: Map<string, number[]>;

  constructor(el: Element, options: Options) {
    this.el = el;
    this.options = this.parseOptions(options);
    this.classTimeouts = new Map();
  }

  addClass(className: string, options?: Options) {
    this.manageClass(Method.Add, className, options);
  }
  removeClass(className: string, options?: Options) {
    this.manageClass(Method.Remove, className, options);
  }
  protected manageClass = manageClass;
  protected clearClassTimeouts = clearClassTimeouts;

  parseOptions = parseOptions;
  static parseOptions = parseOptions;
  updateOptions = updateOptions;

  protected emitEvent = emitEvent;
}

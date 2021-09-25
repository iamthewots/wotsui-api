import {
  add,
  clearClassTimeouts,
  manageChildrenClass,
  manageClass,
  manageSelfClass,
  remove,
} from "./methods/class.js";
import emitEvent from "./methods/emit-event.js";
import { getOptions, parseOptions, setOptions } from "./methods/options.js";
import { Options } from "./types";

export default class ClassManager {
  protected el: Element;
  protected options: Options;
  protected classTimeouts: Map<string, number[]> = new Map();

  constructor(el: Element, options: Options) {
    if (!(el instanceof Element)) {
      throw new Error("Invalid element");
    }
    this.el = el;
    this.options = this.parseOptions(options);
  }

  parseOptions = parseOptions;
  static parseOptions = parseOptions;
  getOptions = getOptions;
  setOptions = setOptions;

  add = add;
  remove = remove;
  clearClassTimeouts = clearClassTimeouts;
  protected manageClass = manageClass;
  protected manageSelfClass = manageSelfClass;
  protected manageChildrenClass = manageChildrenClass;

  emitEvent = emitEvent;
}

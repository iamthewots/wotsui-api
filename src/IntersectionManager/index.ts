import { Options } from "./types";
import applyOptions from "./methods/apply-options.js";
import emitEvent from "./methods/emit-event.js";
import getObserver from "./methods/get-observer.js";
import getOptions from "./methods/get-options.js";
import observe from "./methods/observe.js";
import parseOptions from "./methods/parse-options.js";
import unobserve from "./methods/unobserve.js";
import setOptions from "./methods/set-options.js";

export default class IntersectionManager {
  protected options: Options;
  protected optionsList: Map<Element, Options>;
  protected observersList: Map<number, IntersectionObserver>;

  constructor(options: Options) {
    this.options = this.parseOptions(options);
    this.optionsList = new Map();
    this.observersList = new Map();
  }

  parseOptions = parseOptions;
  static parseOptions = parseOptions;
  getOptions = getOptions;
  setOptions = setOptions;
  protected applyOptions = applyOptions;

  observe = observe;
  unobserve = unobserve;
  protected getObserver = getObserver;
  protected emitEvent = emitEvent;
}

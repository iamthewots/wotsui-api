import { Options } from "./types";
import emitEvent from "./methods/emitEvent.js";
import getObserver from "./methods/getObserver.js";
import getOptions from "./methods/getOptions.js";
import observe from "./methods/observe.js";
import parseOptions from "./methods/parseOptions.js";
import unobserve from "./methods/unobserve.js";
import updateOptions from "./methods/updateOptions";

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
  updateOptions = updateOptions;

  protected getObserver = getObserver;
  protected emitEvent = emitEvent;
}

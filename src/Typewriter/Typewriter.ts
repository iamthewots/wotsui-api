import {
  getElementTextLength,
  getElementTextNodes,
  initElement,
} from "./methods/element.js";
import stopChange from "./methods/text-stop.js";
import writeText from "./methods/text-write.js";
import { getOptions, parseOptions, setOptions } from "./methods/options.js";
import { getStatus, setStatus } from "./methods/status.js";
import { ElementData, Options } from "./types";
import clearText from "./methods/text-clear.js";
import deleteText from "./methods/text-delete.js";
import restoreText from "./methods/text-restore.js";

export default class Typewriter {
  protected options: Options;
  protected elementsData: Map<Element, ElementData> = new Map();

  constructor(options: Options) {
    this.options = this.parseOptions(options);
  }

  parseOptions = parseOptions;
  static parseOptions = parseOptions;
  getOptions = getOptions;
  setOptions = setOptions;

  initElement = initElement;
  protected getElementTextNodes = getElementTextNodes;
  protected getElementTextLength = getElementTextLength;

  clearText = clearText;
  deleteText = deleteText;
  restoreText = restoreText;
  writeText = writeText;
  stopChange = stopChange;

  getStatus = getStatus;
  setStatus = setStatus;
}

import { Options } from "./types";
import parseOptions from "./scripts/parse-options.js";

export default class Animator {
  _default_options: Options;
  _elements_db: Map<Element, Options>;
  _animations_db: Map<string, Animation>;

  constructor(options: Options) {
    this._default_options = parseOptions(options);
    this._elements_db = new Map();
    this._animations_db = new Map();
  }
}

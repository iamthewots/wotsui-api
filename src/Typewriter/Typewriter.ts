import parseElement from "./scripts/parse-element.js";
import parseOptions from "./scripts/parse-options.js";
import writeElement from "./scripts/write-element.js";

export interface TypewriterOptions {
  timePerChar: number;
  ignorePunctuation: boolean;
}

export interface TypewriterElementData {
  options?: TypewriterOptions;
  length: number;
  textData: TypewriterElementTextData[];
}

export interface TypewriterElementTextData {
  node: Node;
  textContent: string;
}

export type Options = TypewriterOptions | { [prop: string]: any };

export default class Typewriter {
  _default_options: TypewriterOptions;
  _elements_db: Map<Element, TypewriterElementData>;
  constructor(options: Options) {
    this._default_options = parseOptions(options);
    this._elements_db = new Map();
  }

  initElement(el: Element, options?: Options, clear = true) {
    if (!(el instanceof Element)) {
      throw new Error("Invalid argument");
    }
    let data = parseElement(el, clear);
    let length = 0;
    data.forEach((d) => {
      length += d.textContent.length;
    });
    this._elements_db.set(el, {
      options: options ? parseOptions(options) : undefined,
      length,
      textData: data,
    });
  }

  getOptions(el: Element) {
    const data = this._elements_db.get(el);
    if (!data || !data.options) {
      return this._default_options;
    }
    return { ...this._default_options, ...data.options };
  }

  writeElement(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    const options = this.getOptions(el);
    writeElement(data, options);
  }

  clearElement(el: Element, update?: boolean) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    const td = parseElement(el, true);
    if (update) {
      data.textData = td;
      this._elements_db.set(el, data);
    }
  }

  restoreElement(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    data.textData.forEach((td) => {
      const { node, textContent } = td;
      node.textContent = textContent;
    });
  }
}

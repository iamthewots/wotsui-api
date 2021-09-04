export interface TypewriterOptions {
  timePerChar: number;
  ignorePunctuation?: boolean;
  punctuationMultiplier: number;
  observeOnce?: boolean;
}

interface TypewriterTextData {
  node: Node;
  textContent: string;
}

type Options = { [prop: string]: any } | TypewriterOptions;

export default class Typewriter {
  _observer: IntersectionObserver;
  _default_options: TypewriterOptions;
  _options_list: Map<Element, TypewriterOptions>;
  _text_content: Map<Element, TypewriterTextData[]>;

  constructor(options: Options) {
    this._observer = new IntersectionObserver(
      this.observerCallback.bind(this),
      {
        threshold: 0,
      }
    );
    this._default_options = this.parseOptions(options);
    this._options_list = new Map();
    this._text_content = new Map();
  }

  observerCallback(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      const el = entry.target;
      const options = this._options_list.get(el) || this._default_options;
      if (entry.isIntersecting) {
        this.writeText(el);
        if (options.observeOnce) {
          observer.unobserve(el);
        }
      }
      if (!entry.isIntersecting) {
        this.clearText(el);
      }
    });
  }

  parseOptions(obj: { [prop: string]: any }) {
    const opt: TypewriterOptions = {
      timePerChar: 15,
      punctuationMultiplier: 1,
    };
    if (typeof obj !== "object") {
      return opt;
    }

    opt.ignorePunctuation = !!obj.ignorePunctuation;
    if (typeof obj.timePerChar === "number") {
      opt.timePerChar = obj.timePerChar;
    }
    return opt;
  }

  observe(el: Element, options?: Options, merge?: boolean) {
    this._observer.observe(el);
    const txt = this.extractText(el, true);
    this._text_content.set(el, txt);
    if (options) {
      const opt = this.parseOptions(options);
      if (merge) {
        this._options_list.set(el, { ...this._default_options, ...opt });
      } else {
        this._options_list.set(el, opt);
      }
    }
  }

  extractText(el: Element | Node, clear?: boolean) {
    let txt: TypewriterTextData[] = [];
    el.childNodes.forEach((node) => {
      if (!node.textContent) {
        return txt;
      }
      if (node.nodeType === 3) {
        txt.push({
          node,
          textContent: node.textContent,
        });
        if (clear) {
          node.textContent = "";
        }
      } else {
        txt = txt.concat(this.extractText(node));
      }
    });
    return txt;
  }

  clearText(el: Element) {
    this.extractText(el, true);
  }

  async writeText(el: Element) {
    const options = this._options_list.get(el) || this._default_options;
    const txt = this._text_content.get(el);
    console.log(txt);
    if (!txt) {
      return;
    }
    for (const data of txt) {
      const { node, textContent } = data;
      if (!textContent) {
        continue;
      }
      for (const char of textContent) {
        node.textContent += char;
        const ttw = this.getCharTiming(char, options);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, ttw);
        });
      }
    }
  }

  getCharTiming(char: string, options: TypewriterOptions) {
    if (options.ignorePunctuation) {
      return options.timePerChar;
    }
    if (char.match(/\W\D/gi)) {
      const ttw = options.timePerChar * options.punctuationMultiplier;
      if (",+=-@{}[]()".indexOf(char)) {
        return ttw * 4;
      }
      if (":;".indexOf(char)) {
        return ttw * 8;
      }
      if (".?!".indexOf(char)) {
        return ttw * 16;
      }
      return ttw * 2;
    }
    return options.timePerChar;
  }
}

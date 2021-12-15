import {
    getObserver,
    observerCallback,
    observe,
    unobserve,
} from "./methods/observer.js";
import {
    applyOptions,
    getOptions,
    parseOptions,
    setOptions,
} from "./methods/options.js";
import { Options } from "./types";

export default class IntersectionManager {
    protected options: Options;
    protected optionsList: Map<Element, Options> = new Map();
    protected observersList: Map<number, IntersectionObserver> = new Map();

    constructor(options: Options) {
        this.options = this.parseOptions(options);
    }

    parseOptions = parseOptions;
    static parseOptions = parseOptions;
    getOptions = getOptions;
    setOptions = setOptions;
    protected applyOptions = applyOptions;

    getObserver = getObserver;
    protected observerCallback = observerCallback;
    observe = observe;
    unobserver = unobserve;
}

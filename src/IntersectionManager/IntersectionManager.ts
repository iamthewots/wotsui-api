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
import { IntersectionManagerOptions } from "./types";

export default class IntersectionManager {
    protected options: IntersectionManagerOptions;
    protected optionsList: Map<Element, IntersectionManagerOptions> = new Map();
    protected observersList: Map<number, IntersectionObserver> = new Map();

    constructor(options: IntersectionManagerOptions) {
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

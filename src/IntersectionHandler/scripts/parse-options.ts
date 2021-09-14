import { Options } from "../types";

export default function parseOptions(obj: {
  [prop: string]: any;
}): Options {
  const opt: Options = {};
  if (!obj) {
    return opt;
  }

  opt.observeOnce = !!obj.observeOnce;
  opt.toggleOpacity = !!obj.toggleOpacity;
  if (typeof obj.intersectionClass === "string") {
    opt.intersectionClass = obj.intersectionClass;
  }
  if (typeof obj.noIntersectionClass === "string") {
    opt.noIntersectionClass = obj.noIntersectionClass;
  }
  if (typeof obj.intersectionHandler === "function") {
    opt.intersectionHandler = obj.intersectionHandler;
  }
  if (typeof obj.noIntersectionHandler === "function") {
    opt.noIntersectionHandler = obj.noIntersectionHandler;
  }
  return opt;
}

import { Options } from "../types";

export default function applyOptions(
  el: Element,
  options: Options,
  isIntersecting: boolean
) {
  if (!el || !options) {
    return;
  }
  if (options.toggleOpacity && el instanceof HTMLElement) {
    el.style.opacity = isIntersecting ? "initial" : "0";
  }
  const classToAdd = isIntersecting
    ? options.intersectionClass
    : options.noIntersectionClass;
  const classToRemove = isIntersecting
    ? options.noIntersectionClass
    : options.intersectionClass;
  if (classToAdd) {
    el.classList.add(classToAdd);
  }
  if (classToRemove) {
    el.classList.remove(classToRemove);
  }
}

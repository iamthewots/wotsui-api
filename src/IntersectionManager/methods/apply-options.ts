import IntersectionManager from "../index";

export default function applyOptions(
  this: IntersectionManager,
  entry: IntersectionObserverEntry
) {
  const el = entry.target;
  const opt = this.getOptions(el);
  if (opt.toggleOpacity && el instanceof HTMLElement) {
    el.style.opacity = entry.isIntersecting ? "initial" : "0";
  }
  const classToAdd = entry.isIntersecting
    ? opt.intersectionClass
    : opt.noIntersectionClass;
  const classToRemove = entry.isIntersecting
    ? opt.noIntersectionClass
    : opt.intersectionClass;
  if (classToAdd) el.classList.add(classToAdd);
  if (classToRemove) el.classList.remove(classToRemove);
  return opt;
}

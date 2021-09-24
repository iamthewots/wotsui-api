export default function emitEvent(entry: IntersectionObserverEntry) {
  const el = entry.target;
  const eName = entry.isIntersecting ? "intersection" : "nointersection";
  const e = new CustomEvent(eName, {
    detail: entry,
  });
  el.dispatchEvent(e);
}

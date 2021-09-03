import { IntersectionHandler, Typewriter } from "./dist/index.js";

const handler = new IntersectionHandler(0.25, {
  toggleOpacity: true,
  intersectionClass: "on-int",
  noIntersectionClass: "no-int",
});

document.querySelectorAll("p").forEach((el) => {
  handler.observe(el);
});

const twEl = document.getElementById("typewriter");

const typewriter = new Typewriter(1, {
  timePerChar: 15,
  punctuationMultiplier: 1,
});
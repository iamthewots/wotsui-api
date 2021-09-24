import ProgressManager from "../index";

export default function addCheckpoint(
  this: ProgressManager,
  checkpoint: number | number[]
) {
  if (Array.isArray(checkpoint)) {
    checkpoint.forEach((cp) => {
      this.addCheckpoint(cp);
    });
  }
  if (typeof checkpoint === "number") {
    const val = Math.min(Math.max(0, checkpoint), 100);
    this._checkpoints.add(val);
  }
}

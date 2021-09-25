import ProgressManager from "../ProgressManager";

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
    this.checkpoints.add(checkpoint);
  }
}
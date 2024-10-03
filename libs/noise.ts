export class Noise {
  public x: number = Math.random();
  public y: number = Math.random();
  public z: number = Math.random();

  constructor() {}

  public reset(): void {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
  }
}

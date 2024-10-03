import { Tween } from '../core/tween';
import { Val } from './val';

export class DoubleEase {
  private _rateA: Val = new Val();
  private _rateB: Val = new Val();

  get val(): number {
    return this._rateA.val + this._rateB.val;
  }

  constructor() {}

  public start(opt: { d: number; t: number; a: number; ease: any; delay: number; onComplete?: any; onStart?: any }): void {
    const d = opt.d;
    const t = opt.t;
    const ease = opt.ease != undefined ? opt.ease : Tween.Power3EaseInOut;

    Tween.a(
      this._rateA,
      {
        val: [0, 1 - d],
      },
      t,
      opt.delay,
      ease,
      () => {
        opt.onStart != undefined ? opt.onStart() : null;
      },
      null,
      () => {
        opt.onComplete != undefined ? opt.onComplete() : null;
      },
    );

    Tween.a(
      this._rateB,
      {
        val: [0, d],
      },
      t * opt.a - d,
      opt.delay,
      ease,
    );
  }

  public end(opt: { d: number; t: number; a: number; ease: any; delay: number; onComplete?: any }): void {
    const d = opt.d;
    const t = opt.t;
    const ease = opt.ease != undefined ? opt.ease : Tween.Power3EaseInOut;

    Tween.a(
      this._rateA,
      {
        val: [1 - d, 0],
      },
      t,
      opt.delay,
      ease,
      null,
      null,
      () => {
        opt.onComplete != undefined ? opt.onComplete() : null;
      },
    );

    Tween.a(
      this._rateB,
      {
        val: [d, 0],
      },
      t * opt.a - d,
      opt.delay,
      ease,
    );
  }

  public reset(): void {
    Tween.kill(this._rateA);
    Tween.kill(this._rateB);
    this._rateA.val = 0;
    this._rateB.val = 0;
  }

  public comp(): void {
    Tween.kill(this._rateA);
    Tween.kill(this._rateB);
    this._rateA.val = 0.5;
    this._rateB.val = 0.5;
  }
}

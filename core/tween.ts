import { Power0, Power1, Power2, Power3, Expo, gsap, Elastic } from 'gsap';

export class Tween {
  public static EaseNone: any = Power0.easeNone;

  public static Power1EaseIn: any = Power1.easeIn;
  public static Power1EaseOut: any = Power1.easeOut;
  public static Power1EaseInOut: any = Power1.easeInOut;

  public static Power2EaseIn: any = Power2.easeIn;
  public static Power2EaseOut: any = Power2.easeOut;
  public static Power2EaseInOut: any = Power2.easeInOut;

  public static Power3EaseIn: any = Power3.easeIn;
  public static Power3EaseOut: any = Power3.easeOut;
  public static Power3EaseInOut: any = Power3.easeInOut;

  public static ExpoEaseIn: any = Expo.easeIn;
  public static ExpoEaseOut: any = Expo.easeOut;
  public static ExpoEaseInOut: any = Expo.easeInOut;

  public static SpringA: any = Elastic.easeOut.config(1, 0.75);
  public static SpringB: any = Elastic.easeOut.config(1, 0.5);
  public static SpringC: any = Elastic.easeOut.config(1, 0.75);

  constructor() {}

  public static a(
    target: any,
    param: any,
    duration: number = 1,
    delay: number = 0,
    easing: any = undefined,
    onStart: any = undefined,
    onUpdate: any = undefined,
    onComplete: any = undefined,
  ): void {
    if (target == null || target == undefined) return;

    gsap.killTweensOf(target);

    const from: any = {};
    const to: any = {};

    for (const key in param) {
      const val = param[key];
      if (val[0] != undefined && val[0] != null) {
        from[key] = val[0];
        to[key] = val[1];
      } else {
        to[key] = val;
      }
    }

    gsap.set(target, from);

    if (easing == undefined) {
      easing = Power0.easeNone;
    }
    to['ease'] = easing;

    to['duration'] = duration;
    to['delay'] = delay;

    if (onStart != undefined) {
      to['onStart'] = onStart;
    }

    if (onUpdate != undefined) {
      to['onUpdate'] = onUpdate;
    }

    if (onComplete != undefined) {
      to['onComplete'] = onComplete;
    }

    gsap.to(target, to);
  }

  public static set(target: any, to: any): void {
    gsap.set(target, to);
  }

  public static kill(target: any): void {
    gsap.killTweensOf(target);
  }

  public static wait(target: any, duration: number, onComplete: any = undefined): void {
    gsap.killTweensOf(target);

    const from: any = {};
    const to: any = {};

    from['val'] = 0;
    gsap.set(target, from);

    to['duration'] = duration;
    if (onComplete != undefined) {
      to['onComplete'] = onComplete;
    }
    to['val'] = 1;

    gsap.to(target, to);
  }

  // public static wait(time: number, onComplete: any = undefined): void {
  //   gsap.to(
  //     {
  //       val: 0,
  //     },
  //     {
  //       val: 1,
  //       duration: time,
  //       onComplete: onComplete,
  //     },
  //   )
  // }
}

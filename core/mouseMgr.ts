import { Point } from '../libs/point';
import { Update } from '../libs/update';
import { Util } from '../libs/util';
import { Val } from '../libs/val';
import { Conf } from './conf';
import { Tween } from './tween';

export class MouseMgr {
  private static _instance: MouseMgr;

  private _wait: Val = new Val(0);

  public x: number = window.innerWidth * 9999;
  public y: number = window.innerHeight * 9999;
  public old: Point = new Point();
  public d: Point = new Point();
  public touch: Array<Point> = [];
  public pinchValue: number = 0;
  public normal: Point = new Point();
  public easeNormal: Point = new Point();
  public start: Point = new Point();
  public moveDist: Point = new Point();
  public buffer: Point = new Point();
  public dist: number = 0;
  public isDown: boolean = false;
  public usePreventDefault: boolean = false;
  public useSwipe: boolean = true;
  public moveTotal: number = 0;

  public tNum: number = 0;
  public tVal: Array<Point> = [];
  public tStartVal: Array<Point> = [];
  public tOldVal: Array<Point> = [];
  public tDistVal: Array<Point> = [];
  public tMoveVal: Array<Point> = [];

  public get isPinch(): boolean {
    return this.tNum >= 2;
  }

  public onTouchStart: Array<any> = [];
  public onTouchEnd: Array<any> = [];
  public onSwipe: Array<any> = [];
  public onPinchStart: Array<any> = [];

  public onMouseUp: Array<any> = [];

  public isTouchDevice: boolean = false;

  private _updateHandler: any;
  private _useWheel: boolean = false;

  private _use: boolean = true;

  constructor() {
    if (Util.isTouchDevice() && !Conf.IS_WIN) {
      this.isTouchDevice = true;
      window.addEventListener(
        'touchstart',
        (e: any = {}) => {
          this._eTouchStart(e);
        },
        { passive: false },
      );
      window.addEventListener(
        'touchend',
        (e: any = {}) => {
          this._eTouchEnd(e);
        },
        { passive: false },
      );
      window.addEventListener(
        'touchmove',
        (e: any = {}) => {
          this._eTouchMove(e);
        },
        { passive: false },
      );
    } else {
      this.isTouchDevice = false;
      window.addEventListener('mousedown', (e: any = {}) => {
        this._eDown(e);
      });
      window.addEventListener('mouseup', (e: any = {}) => {
        this._eUp(e);
      });
      window.addEventListener('mousemove', (e: any = {}) => {
        this._eMove(e);
      });

      window.addEventListener(
        'wheel',
        (e) => {
          if (this.usePreventDefault) {
            e.preventDefault();
            e.stopPropagation();
          }

          if (this.useSwipe) {
            const test = Math.abs(e.deltaY);
            // Param.instance.debug.innerHTML = String(test);
            if (test > 5 && this._useWheel) {
              if (this.onSwipe != undefined) {
                this.onSwipe.forEach((val) => {
                  if (val != undefined) val({ move: e.deltaY });
                });
              }
              this._useWheel = false;
              setTimeout(() => {
                this._useWheel = true;
              }, 1000);
            }
          }
        },
        { passive: false },
      );
    }

    this._updateHandler = this._update.bind(this);
    Update.instance.add(this._updateHandler);
  }

  public static get instance(): MouseMgr {
    if (!this._instance) {
      this._instance = new MouseMgr();
    }
    return this._instance;
  }

  public getVal(): Point {
    if (this.isTouchDevice) {
      if (this.tVal.length > 0) {
        return this.tVal[0];
      } else {
        return new Point(0, 0);
      }
    } else {
      return new Point(this.x, this.y);
    }
  }

  public getStartVal(): Point {
    return this.buffer;
    // if(this.isTouchDevice) {
    //   if(this.tStartVal.length > 0) {
    //     return this.tStartVal[0]
    //   } else {
    //     return new Point(0, 0)
    //   }
    // } else {
    //   return new Point(this.x, this.y)
    // }
  }

  private _ePinchStart(): void {
    this.onPinchStart.forEach((val) => {
      if (val != undefined) val();
    });
  }

  private _eTouchStart(e: any = {}): void {
    if (!this._use) {
      this._updateBufferTouchPoint(e);
      return;
    }
    this.isDown = true;

    this._updateTouchPoint(e);

    this.tDistVal = [];

    this.tStartVal = this.tVal.concat();
    this.tOldVal = this.tVal.concat();

    this.tMoveVal = [];
    for (let i = 0; i < this.tVal.length; i++) {
      this.tMoveVal[i] = new Point(this.tStartVal[i].x - this.tVal[i].x, this.tStartVal[i].y - this.tVal[i].y);
    }

    if (this.tNum >= 2) {
      this._ePinchStart();
    }

    this.onTouchStart.forEach((val) => {
      if (val != undefined) val();
    });
  }

  private _eTouchEnd(e: any = {}): void {
    if (!this._use) return;

    this._updateTouchPoint(e);
    if (this.tNum <= 0) this.isDown = false;

    // スワイプ判定
    if (this.useSwipe) {
      const dx = this.tDistVal.length > 0 ? this.tDistVal[0].x : 0;
      const limit = 5;
      if (Math.abs(dx) > limit) {
        if (this.onSwipe != undefined) {
          this.onSwipe.forEach((val) => {
            if (val != undefined) val({ move: dx });
          });
        }
      }
    }

    this.dist = 0;

    this.onTouchEnd.forEach((val) => {
      if (val != undefined) val(e);
    });
  }

  private _eTouchMove(e: any = {}): void {
    if (!this._use) {
      this._updateBufferTouchPoint(e);
      return;
    }

    this.tOldVal = this.tVal.concat();

    this._updateTouchPoint(e);

    // 距離
    this.tDistVal = [];
    const len = this.tVal.length;
    for (let i = 0; i < len; i++) {
      this.tDistVal[i] = new Point(this.tOldVal[i].x - this.tVal[i].x, this.tOldVal[i].y - this.tVal[i].y);
    }

    // スタートからの移動距離
    this.tMoveVal = [];
    for (let i = 0; i < len; i++) {
      this.tMoveVal[i] = new Point(this.tStartVal[i].x - this.tVal[i].x, this.tStartVal[i].y - this.tVal[i].y);
    }

    if (this.tDistVal.length > 0) {
      this.d = this.tDistVal[0];
    }

    if (this.usePreventDefault) {
      e.preventDefault();
    }
  }

  private _eDown(e: any = {}): void {
    if (!this._use) {
      this.buffer.set(e.clientX, e.clientY);
      return;
    }

    this.isDown = true;
    this._eMove(e);

    this.start.x = this.x;
    this.start.y = this.y;
  }

  private _eUp(e: any = {}): void {
    if (!this._use) return;

    this.isDown = false;

    // スワイプ判定
    if (this.useSwipe) {
      const limit = 5;
      if (Math.abs(this.d.x) > limit) {
        if (this.onSwipe != undefined) {
          this.onSwipe.forEach((val) => {
            if (val != undefined) val({ move: this.d.x });
          });
        }
      }
    }

    this.onMouseUp.forEach((val) => {
      if (val != undefined) val(e);
    });
  }

  private _eMove(e: any = {}): void {
    if (!this._use) {
      this.buffer.set(e.clientX, e.clientY);
      return;
    }

    this.old.x = this.x;
    this.old.y = this.y;

    this.x = e.clientX;
    this.y = e.clientY;

    this.buffer.x = e.clientX;
    this.buffer.y = e.clientY;

    const dx = this.old.x - this.x;
    const dy = this.old.y - this.y;
    this.dist = Math.sqrt(dx * dx + dy * dy);

    this.d.x = dx;
    this.d.y = dy;

    if (this.dist < 200) this.moveTotal += this.dist;
  }

  private _updateTouchPoint(e: TouchEvent): void {
    this.tVal = [];
    const touches: TouchList = e.touches;
    if (touches != null && touches.length > 0) {
      const len = touches.length;
      for (let i = 0; i < len; i++) {
        this.tVal[i] = new Point(touches[i].clientX, touches[i].clientY);
        this.buffer = new Point(touches[i].clientX, touches[i].clientY);
      }
    }
    this.tNum = this.tVal.length;

    // ピンチ距離計算
    this.pinchValue = 0;
    if (this.tNum >= 2) {
      const d = this.tVal[0].distance(this.tVal[1]);
      this.pinchValue = d;
    }

    if (this.tVal.length > 0) {
      this.x = this.tVal[0].x;
      this.y = this.tVal[0].y;
    }
  }

  private _updateBufferTouchPoint(e: TouchEvent): void {
    const touches: TouchList = e.touches;
    if (touches != null && touches.length > 0) {
      const len = touches.length;
      for (let i = 0; i < len; i++) {
        this.buffer = new Point(touches[i].clientX, touches[i].clientY);
      }
    }
  }

  public getTouchPoint(e: TouchEvent): Point {
    const p = new Point();
    const touches: TouchList = e.touches;
    if (touches != null && touches.length > 0) {
      p.x = touches[0].pageX;
      p.y = touches[0].pageY;
    }
    return p;
  }

  private _update(): void {
    if (this.isDown) {
      this.moveDist.x = this.start.x - this.x;
      this.moveDist.y = this.start.y - this.y;
    } else {
      this.moveDist.x += (0 - this.moveDist.x) * 0.25;
      this.moveDist.y += (0 - this.moveDist.y) * 0.25;
    }

    this.normal.x = Util.map(this.x, -1, 1, 0, window.innerWidth);
    this.normal.y = Util.map(this.y, -1, 1, 0, window.innerHeight);

    const ease = 0.05;
    this.easeNormal.x += (this.normal.x - this.easeNormal.x) * ease;
    this.easeNormal.y += (this.normal.y - this.easeNormal.y) * ease;
  }

  public setUse(b: boolean): void {
    Tween.kill(this._wait);

    if (!b) {
      this._use = b;
      if (!this._use) {
        this.isDown = false;
        this.tNum = 0;
      }
    } else {
      Tween.a(
        this._wait,
        {
          val: [0, 1],
        },
        0.2,
        0,
        Tween.EaseNone,
        null,
        null,
        () => {
          this._use = b;
          if (!this._use) {
            this.isDown = false;
            this.tNum = 0;
          }
        },
      );
    }
  }
}

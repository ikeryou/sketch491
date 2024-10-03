import { Display, DisplayConstructor } from '../libs/display';
import { Update } from '../libs/update';
import { Resize } from '../libs/resize';
import { Point } from '../libs/point';
import { Func } from './func';
import { Util } from '../libs/util';
import { Rect } from '../libs/rect';

export class MyDisplay extends Display {
  private _updateHandler: any;
  private _resizeHandler: any;

  protected _isVisible: boolean = true;
  protected _dispId: number = 0;
  protected _elSize: Rect = new Rect();
  protected _c: number = 0;
  protected _isEnter: boolean = false;
  protected _isOneEnter: boolean = false;
  protected _observer: any;
  protected _elPos: Point = new Point(0, 9999);
  protected _eRollOverHandler: any;
  protected _eRollOutHandler: any;

  public set isEnter(v: boolean) {
    this._isEnter = v;
  }

  public get isEnter(): boolean {
    return this._isEnter;
  }

  protected _isShow: boolean = false;
  public set isShow(b: boolean) {
    this._isShow = b;
  }
  public get isShow(): boolean {
    return this._isShow;
  }

  constructor(opt: DisplayConstructor) {
    super(opt);

    this._dispId = Number(opt.dispId);

    this._updateHandler = this._update.bind(this);
    Update.instance.add(this._updateHandler);

    this._resizeHandler = this._resize.bind(this);
    Resize.instance.add(this._resizeHandler);
  }

  init() {
    super.init();
  }

  //
  protected _setClickEvent(el: HTMLElement, f: any) {
    el.addEventListener('click', () => {
      f();
    });
  }

  //
  public useGPU(el: HTMLElement) {
    this.css(el, {
      'will-change': 'transform',
    });
  }

  //
  protected _setMakedClass() {
    this.addClass('-maked');
  }

  //
  protected _setHover() {
    this._eRollOverHandler = this._eRollOver.bind(this);
    this._eRollOutHandler = this._eRollOut.bind(this);
    this.getEl().addEventListener('mouseenter', this._eRollOverHandler);
    this.getEl().addEventListener('mouseleave', this._eRollOutHandler);
  }

  //
  protected _disposeHover() {
    if (this._eRollOverHandler != null) {
      this.getEl().removeEventListener('mouseenter', this._eRollOverHandler);
      this.getEl().removeEventListener('mouseleave', this._eRollOutHandler);
      this._eRollOverHandler = null;
      this._eRollOutHandler = null;
    }
  }

  //
  protected _eRollOver() {}

  //
  protected _eRollOut() {}

  //
  protected _setObserver(rootMargin: string = '0px') {
    this._isEnter = false;
    this._observer = new IntersectionObserver(
      (e) => {
        if (e != undefined) {
          e.forEach((val) => {
            if (val != undefined && val.isIntersecting) {
              this._eEnter();
            } else {
              this._eLeave();
            }
          });
        }
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: 0,
      },
    );

    setTimeout(() => {
      if (this._observer != undefined && this._observer != null) {
        const tg = this.getEl();
        if (tg != undefined) this._observer.observe(tg);
      }
    }, 100);
  }

  //
  protected _eEnter() {
    this._isEnter = true;
  }

  //
  protected _eLeave() {
    this._isEnter = false;
  }

  protected _disposeObserver() {
    if (this._observer != null || this._observer != undefined) {
      this._observer.unobserve(this.getEl());
      this._observer = null;
    }
  }

  // 破棄
  public dispose() {
    if (this._updateHandler != undefined) {
      Update.instance.remove(this._updateHandler);
      this._updateHandler = null;
    }

    if (this._resizeHandler != undefined) {
      Resize.instance.remove(this._resizeHandler);
      this._resizeHandler = null;
    }

    this._disposeHover();
    this._disposeObserver();

    super.dispose();
  }

  css(el: any, obj: any): void {
    const style = el.style;
    for (const key in obj) {
      style[key] = obj[key];
    }
  }

  protected _updateElSize(): void {
    this._elSize.y = this.getOffsetTop(this.el);
    this._elSize.width = this.getWidth(this.el);
    this._elSize.height = this.el.offsetHeight;
  }

  protected _update(): void {
    this._c++;
  }

  protected _resize(): void {}

  //
  protected _v(xs: any, lg: any): any {
    return Func.val(xs, lg);
  }

  //
  protected _tag(tag: string, c: string = ''): HTMLElement {
    const t = document.createElement(tag);
    if (c != '') t.classList.add(c);
    return t;
  }

  public map(num: number, toMin: number, toMax: number, fromMin: number, fromMax: number): number {
    return Util.map(num, toMin, toMax, fromMin, fromMax);
  }

  public setVisible(b: boolean): void {
    this._isVisible = b;
    if (b) {
      this.removeClass('-hide');
    } else {
      this.addClass('-hide');
    }
  }

  public list(sel: string, arr: Array<any>): void {
    this.qsAll(sel).forEach((el: HTMLElement) => {
      arr.push(el);
    });
  }

  public setPointer(b: boolean): void {
    if (!b) {
      this.addClass('s-no-pointer');
    } else {
      this.removeClass('s-no-pointer');
    }
  }
}

import { Rect } from './rect';

export class Resize {
  private static _instance: Resize;

  // レイアウト更新時に実行させる関数を保持
  private _list: Array<any> = [];

  private _timer: any = null;

  public size: Rect = new Rect();
  public oldSize: Rect = new Rect();

  constructor() {
    window.addEventListener(
      'resize',
      () => {
        this._eResize();
      },
      false,
    );
  }

  public static get instance(): Resize {
    if (!this._instance) {
      this._instance = new Resize();
    }
    return this._instance;
  }

  private _eResize(): void {
    this._setStageSize();

    if (this.oldSize.width == this.size.width && this.oldSize.height == this.size.height) {
      return;
    }

    if (this._timer === null) {
      clearInterval(this._timer);
      this._timer = null;
    }

    this._timer = setTimeout(() => {
      this._call();
      this.oldSize.width = this.size.width;
      this.oldSize.height = this.size.height;
    }, 300);
  }

  private _setStageSize(): void {
    this.size.width = window.innerWidth;
    this.size.height = window.innerHeight;
  }

  public add(f: any) {
    this._list.push(f);
  }

  public remove(f: any) {
    const arr: Array<any> = [];
    this._list.forEach((val) => {
      if (val != f) {
        arr.push(val);
      }
    });
    this._list = arr;
  }

  private _call = () => {
    for (const item of this._list) {
      if (item != null) item();
    }
  };
}

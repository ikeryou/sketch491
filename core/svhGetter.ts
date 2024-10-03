import { Resize } from '../libs/resize';
import { Update } from '../libs/update';

export class SvhGetter {
  private static _instance: SvhGetter;

  public val: number = 0;

  private _tg: HTMLElement | undefined;
  private _getNum: number = 0;

  constructor() {
    this._tg = document.querySelector('.js-svh') as HTMLElement;
    if (this._tg == null) {
      this._tg = document.createElement('div');
      document.body.append(this._tg);
      this._tg.classList.add('js-svh');
    }

    Update.instance.add(() => {
      this._eUpdate();
    });

    Resize.instance.add(() => {
      this._eResize();
    });

    this._eUpdate();
    this._eResize();
  }

  public static get instance(): SvhGetter {
    if (!this._instance) {
      this._instance = new SvhGetter();
    }
    return this._instance;
  }

  private _eUpdate(): void {
    if (this._tg != undefined && this._getNum < 100) {
      this.val = this._tg.clientHeight;
      this._getNum++;
    }
  }

  private _eResize(): void {
    this._getNum = 0;
  }
}

import { Func } from '../core/func';
import { MyDisplay } from '../core/myDisplay';
import { Tween } from '../core/tween';
import { DisplayConstructor } from '../libs/display';
import { Util } from '../libs/util';
import { Val } from '../libs/val';


export class Line extends MyDisplay {

  private _total: number = Func.val(50, 150);
  private _text: Array<{
    t: string,
    start: number,
    end: number,
  }> = [];
  private _allTexts: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  private _showRateA: Val = new Val(0);
  private _showRateB: Val = new Val(0);

  private _isShowed: boolean = false;
  private _isLast: boolean = false;

  constructor(opt: DisplayConstructor, isLast: boolean = false) {
    super(opt);

    this._isLast = isLast;

    let str = '';
    for (let i = 0; i < this._total; i++) {
      str += '<span>_</span>'
    }
    this.el.innerHTML = str;

    let now = 0
    const num = Util.randomInt(1, 5);
    for(let i = 0; i < num; i++) {
      const t = Util.randomArr([
        'Home', 'About', 'Service', 'Works', 'Contact', 'Blog', 'News', 'Shop', 'Cart', 'Account', 'Login', 'Logout', 'Register', 'Search', 'Privacy', 'Policy', 'Terms', 'Conditions', 'FAQ', 'Help', 'Support', 'Contact', 'Sitemap', '404'
      ]);

      if(now + t.length < this._total - 3) {
        const start = Util.random(now, this._total - 3 - t.length);
        const end = start + t.length;
        this._text.push({
          t: t,
          start: start,
          end: end,
        });

        now += end;
      }
    }
  }


  public show(d: number = 0): void {
    const t = 1
    Tween.a(this._showRateA, {
      val: [0, 1]
    }, t, d, Tween.ExpoEaseOut)

    Tween.a(this._showRateB, {
      val: [0, 1]
    }, t, d + t * 0.75, Tween.ExpoEaseInOut, null, null, () => {
      this.hide(2)
    }) 
  }


  public hide(d: number = 0): void {
    const t = 1
    Tween.a(this._showRateA, {
      val: 0
    }, t, d + t * 0.75, Tween.ExpoEaseOut, null, null, () => {
      if(!this._isLast) {
        this.el.innerHTML = '<span>_</span>';
      }
      this.show(2)
    }) 

    Tween.a(this._showRateB, {
      val: 0
    }, t, d, Tween.ExpoEaseInOut, () => {
      this._isShowed = false;
    }) 
  }


  // 更新
  protected _update(): void {
    super._update();

    const sA = this._showRateA.val;
    const sB = this._showRateB.val;

    if(sA <= 0 || this._isShowed || this._isLast) return

    let str = '';
    const etc = Util.map(sB, 0, this._total, 0, 1);
    const num = Util.map(sA, 0, this._total, 0, 1);
    for (let i = 0; i < num; i++) {
      let isText = false;
      this._text.forEach((val) => {
        if(val.start <= i && i <= val.end) {
          str += val.t.charAt(i - val.start);
          isText = true;
        }
      })

      if (!isText) {
        if(i >= etc) {
          str += this._allTexts.charAt(Util.random(0, this._allTexts.length - 1));
        } else {
          str += '<span>_</span>'
        }
      }
    }

    this.el.innerHTML = str;

    

    if(sB >= 1) {
      this._isShowed = true;
    }
  }
}


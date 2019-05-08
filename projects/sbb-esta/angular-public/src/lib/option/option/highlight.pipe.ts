import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (typeof value === 'string') {
      const re = new RegExp(this._escape(args), 'gi');
      return value.replace(
        re,
        m => `<span #highlight class='highlight'>${m}</span>`
      );
    }

    return value;
  }

  private _escape(value: any = '') {
    return typeof value === 'string'
      ? value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      : value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  private escape(value: any = '') {
    if (typeof value === 'string') {
      return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    return value;
  }

  transform(value: any, args?: any): any {
    let result = value;
    if (value) {
      const re = new RegExp(this.escape(args), 'gi');
      result = value.replace(re, m => `<span #highlight class='highlight'>${m}</span>`);
    }
    return result;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  private escape(regex: string = '') {
    return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  transform(value: any, args?: any): any {
    let result = value;
    if(value) {
      const re = new RegExp(this.escape(args), 'gi');
      result = value.replace(re, m => `<span #highlight class='highlight'>${m}</span>` );
    }

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}

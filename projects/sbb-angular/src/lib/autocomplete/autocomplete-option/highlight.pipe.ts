import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    // TODO: remove this please...........
    if (!args || !value) {
      return value;
    }
    const re = new RegExp(args, 'gi');
    const match = value.match(re);

    let result = value;
    if (match) {
      result = result.replace(re, `<span class='highlight'>${match[0]}</span>` );
    }

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}

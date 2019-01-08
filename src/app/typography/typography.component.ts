import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sbb-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent {

  @ViewChildren('pageLink') pageLinks: QueryList<ElementRef>;

  private editorOptionsBase = {
    theme: 'vs-dark',
    codeLens: false,
    readOnly: true,
    lineNumbers: 'off',
    minimap: { enabled: false }
  };

  DASH_CASE_REGEXP = RegExp('-([a-z])', 'g');


  editorOptionsHtml = Object.assign({}, this.editorOptionsBase, { language: 'html' });

  editorOptionsScss = Object.assign({}, this.editorOptionsBase, { language: 'scss' });

  code = {
    globalSettings: '',
    unorderedList: '',
    nestedUnorderedList: '',
    orderedList: '',
    nestedOrderedList: '',
    mixedList: '',
    table: '',
    fieldset: '',
    headings: ''
  };

  constructor(private _sanitizer: DomSanitizer, private http: HttpClient) {
    this.getSample('global-settings', 'scss');
    this.getSample('unordered-list');
    this.getSample('ordered-list');
    this.getSample('nested-ordered-list');
    this.getSample('nested-unordered-list');
    this.getSample('mixed-list');
    this.getSample('table');
    this.getSample('fieldset');
    this.getSample('headings');
  }

  dashCaseToCamelCase(input: string): string {
    return input.replace(this.DASH_CASE_REGEXP, (m) => {
      return m[1].toUpperCase();
    });
  }

  private getSample(filename: string, type: 'html' | 'scss' = 'html') {
    this.http
      .get(`docs/typography/samples/${filename}.${type}`, { responseType: 'text' })
      .subscribe((response: any) => this.code[this.dashCaseToCamelCase(filename)] = response);
  }

  getRawHTML(htmlString: string) {
    return this._sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  goToInpageLink(evt: any, pageLinkIndex: number) {
    evt.preventDefault();
    this.pageLinks.toArray()[pageLinkIndex].nativeElement.focus();
  }
}

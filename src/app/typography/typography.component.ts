import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'sbb-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent {

  @ViewChildren('pageLink') pageLinks: QueryList<ElementRef>;

  private _editorOptionsBase = {
    theme: 'vs-dark',
    codeLens: false,
    readOnly: true,
    lineNumbers: 'off',
    minimap: { enabled: false }
  };

  dashCaseRegexp = RegExp('-([a-z])', 'g');

  editorOptionsHtml = Object.assign({}, this._editorOptionsBase, { language: 'html' });

  editorOptionsScss = Object.assign({}, this._editorOptionsBase, { language: 'scss' });

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

  constructor(
    private _sanitizer: DomSanitizer,
    private _http: HttpClient,
  ) {
    this._getSample('global-settings', 'scss');
    this._getSample('unordered-list');
    this._getSample('ordered-list');
    this._getSample('nested-ordered-list');
    this._getSample('nested-unordered-list');
    this._getSample('mixed-list');
    this._getSample('table');
    this._getSample('fieldset');
    this._getSample('headings');
  }

  dashCaseToCamelCase(input: string): string {
    return input.replace(this.dashCaseRegexp, m => m[1].toUpperCase());
  }

  private _getSample(filename: string, type: 'html' | 'scss' = 'html') {
    this._http
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

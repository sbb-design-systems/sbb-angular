import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import { UiComponent } from '../shared/ui-component';

@Directive({
  selector: '[sbbDoc]'
})
export class DocDirective implements OnInit {
  private _hostElement: HTMLElement;

  @Input() type = 'api';

  componentType: string;

  @Input() sbbDoc: UiComponent;
  @Input() htmlExample?: string;

  constructor(private _http: HttpClient, elementRef: ElementRef) {
    this._hostElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.componentType = this.sbbDoc.isComponent ? 'component' : 'directive';
    this._http
      .get(this.apiDocHTMLName, { responseType: 'text' })
      .subscribe(
        (html: any) => (this.templateHtml = html ? html : '/* No content */')
      );
  }

  set templateHtml(value) {
    this._hostElement.innerHTML = value;
  }

  get apiDocHTMLName() {
    let docsUrl = 'docs/';
    switch (this.type) {
      case 'ts':
        docsUrl += `examples/${this.sbbDoc.routerLink}-showcase.${
          this.componentType
        }-ts`;
        break;
      case 'html':
        docsUrl += `examples/${this.sbbDoc.routerLink}-showcase.${
          this.componentType
        }-html`;
        break;
      case 'scss':
        docsUrl += `examples/${this.sbbDoc.routerLink}-showcase.${
          this.componentType
        }-scss`;
        break;
      case 'md':
        docsUrl += `markdown/${this.sbbDoc.routerLink}-showcase/sbb-angular-${
          this.sbbDoc.routerLink
        }`;
        break;
      case 'htmlExample':
        docsUrl += `examples/${this.sbbDoc.routerLink}-showcase-${
          this.htmlExample
        }.${this.componentType}-html`;
        break;
      default:
        docsUrl += `api/sbb-angular-${this.sbbDoc.routerLink}`;

        break;
    }
    return docsUrl + '.html';
  }
}

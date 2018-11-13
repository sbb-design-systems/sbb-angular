import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UiComponent } from '../shared/ui-component';


@Directive({
  selector: '[sbbDoc]',

})
export class DocDirective implements OnInit {

  private hostElement: HTMLElement;

  @Input() type?: string = 'api';

  componentType: string;

  @Input() sbbDoc: UiComponent;

  constructor(private http: HttpClient, elementRef: ElementRef) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.componentType = this.sbbDoc.isComponent ? 'component' : 'directive';
    this.http
      .get(this.apiDocHTMLName, { responseType: 'text' })
      .subscribe((html: any) => this.templateHtml = html);

  }

  set templateHtml(value) {
    this.hostElement.innerHTML = value;
  }

  get apiDocHTMLName() {
    let docsUrl = 'docs/';
    switch (this.type) {
      case 'ts':
        docsUrl += 'examples/' + this.sbbDoc.routerLink + '-showcase.' + this.componentType + '-ts';
        break;
      case 'html':
        docsUrl += 'examples/' + this.sbbDoc.routerLink + '-showcase.' + this.componentType + '-html';
        break;
      case 'scss':
        docsUrl += 'examples/' + this.sbbDoc.routerLink + '-showcase.' + this.componentType + '-scss';
        break;
      case 'md':
        docsUrl += 'markdown/' + this.sbbDoc.routerLink + '-showcase/sbb-angular-' + this.sbbDoc.routerLink;
        break;
      default:
        docsUrl += 'api/sbb-angular-' + this.sbbDoc.routerLink;

        break;
    }
    return docsUrl + '.html';
  }

}

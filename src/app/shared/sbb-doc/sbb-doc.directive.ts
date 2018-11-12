import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UiComponent } from '../ui-component';

@Directive({
  selector: '[sbbDoc]',

})
export class SbbDocDirective implements OnInit {

  private hostElement: HTMLElement;

  @Input() type?: string = 'api';

  componentType: string;

  @Input() sbbDoc: UiComponent;

  constructor(private http: HttpClient, elementRef: ElementRef) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.componentType = this.sbbDoc.isComponent ? 'component' : 'directive';

  /*   const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/html',
        'Accept': 'text/html'
      })
    }; */
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
      default:
        docsUrl += 'api/sbb-angular-' + this.sbbDoc.routerLink;

        break;
    }
    return docsUrl + '.html';
  }


}

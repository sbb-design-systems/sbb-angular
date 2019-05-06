import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'sbb-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GettingStartedComponent implements OnInit {
  @HostBinding('class.sbb-getting-started')
  cssClass = true;

  hostElement: HTMLElement;

  constructor(private _http: HttpClient, elementRef: ElementRef) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this._http
      .get('docs/markdown/sbb-angular-getting-started.html', {
        responseType: 'text'
      })
      .subscribe(
        (html: any) => (this.templateHtml = html ? html : '/* No content */')
      );
  }

  set templateHtml(value: string) {
    this.hostElement.innerHTML = value;
  }
}

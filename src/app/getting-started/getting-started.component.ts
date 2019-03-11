import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sbb-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {

  hostElement: HTMLElement;

  constructor(private http: HttpClient, elementRef: ElementRef) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.http
      .get('docs/markdown/sbb-angular-getting-started.html', { responseType: 'text' })
      .subscribe((html: any) => this.templateHtml = html ? html : '/* No content */');

  }

  set templateHtml(value: string) {
    this.hostElement.innerHTML = value;
  }
}

import { Component, ChangeDetectionStrategy, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent implements OnInit {
  @Input() mode: 'normal' | 'stretch' | 'form' = 'normal';
  @Input() icon: 'arrow' | 'download' = 'arrow';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.mode !== 'normal') {
      this.renderer.addClass(this.elementRef.nativeElement, `var-${this.mode}`);
    }
  }
}

import { Component, OnInit, ChangeDetectionStrategy, Input, HostListener, EventEmitter } from '@angular/core';
import { PageDescriptor } from '../page-descriptor.model';

@Component({
  selector: 'sbb-page-number',
  templateUrl: './page-number.component.html',
  styleUrls: ['./page-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNumberComponent {

  @Input()
  mode: 'link' | 'button' = 'button';

  descriptor: PageDescriptor = new PageDescriptor();

  pageClicked: EventEmitter<PageDescriptor> = new EventEmitter<PageDescriptor>();

  @Input()
  set index(value: number) {
    this.descriptor.index = value;
  }
  get index(): number {
    return this.descriptor.index;
  }

  @Input()
  set displayNumber(value: number) {
    this.descriptor.displayNumber = value;
  }
  get displayNumber(): number {
    return this.descriptor.displayNumber;
  }

  @HostListener('click')
  onClick() {
    this.pageClicked.emit(this.descriptor);
  }

}

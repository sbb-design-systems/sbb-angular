import { Component, ChangeDetectionStrategy, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'sbb-pagination-item',
  templateUrl: './pagination-item.component.html',
  styleUrls: ['./pagination-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaginationItemComponent {

  @HostBinding('class.sbb-pagination-item')
  cssClass = true;

  @Input()
  mode: 'link' | 'button' = 'button';

  @Input()
  tabindex = 0;

  @Input()
  selected = false;

  @Input()
  disabled = false;

  @Input()
  set ellipsis(value: boolean) {
    this._ellipsis = coerceBooleanProperty(value);
  }
  get ellipsis(): boolean {
    return this._ellipsis;
  }
  private _ellipsis: boolean;

  @Input()
  set boundary(value: boolean) {
    this._boundary = coerceBooleanProperty(value);
  }
  get boundary(): boolean {
    return this._boundary;
  }
  private _boundary: boolean;


  preventDefault($event) {
    $event.preventDefault();
  }
}

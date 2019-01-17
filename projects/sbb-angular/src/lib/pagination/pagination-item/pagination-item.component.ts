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

  /** @docs-private */
  @HostBinding('class.sbb-pagination-item')
  cssClass = true;

  /** 
   * Rendering mode for this item: button or link (default is button)
   */
  @Input()
  mode: 'link' | 'button' = 'button';

  @Input()
  tabindex = 0;

  @Input()
  selected = false;

  @Input()
  disabled = false;

  /**
   * Used to know when apply ellipsis styles on the button/link
   */
  @Input()
  set ellipsis(value: boolean) {
    this._ellipsis = coerceBooleanProperty(value);
  }
  get ellipsis(): boolean {
    return this._ellipsis;
  }
  private _ellipsis: boolean;

  /**
   * Used to know when apply boundary styles on the button/link
   */
  @Input()
  set boundary(value: boolean) {
    this._boundary = coerceBooleanProperty(value);
  }
  get boundary(): boolean {
    return this._boundary;
  }
  private _boundary: boolean;

  /**
   * When using link mode, this methods prevents the default behaviour of the link itself
   */
  preventDefault($event) {
    $event.preventDefault();
  }
}

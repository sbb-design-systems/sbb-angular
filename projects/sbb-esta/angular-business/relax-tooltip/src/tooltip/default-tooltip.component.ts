import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-default-tooltip',
  templateUrl: './default-tooltip.component.html',
  styleUrls: ['./default-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tooltip', [
      transition(':enter', [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
      transition(':leave', [animate(300, style({ opacity: 0 }))])
    ])
  ]
})
export class DefaultTooltipComponent {
  private _text: string;
  /**
   * Set text for the tooltip.
   */
  @Input()
  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
    this._changeDetectorRef.markForCheck();
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}
}

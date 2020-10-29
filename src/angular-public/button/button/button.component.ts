import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIconDirective } from '@sbb-esta/angular-core/icon-directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-button',
    '[class.sbb-button-primary]': 'this.mode === "primary"',
    '[class.sbb-button-secondary]': 'this.mode === "secondary"',
    '[class.sbb-button-ghost]': 'this.mode === "ghost"',
    '[class.sbb-button-frameless]': 'this.mode === "frameless"',
    '[class.sbb-button-has-icon]': '!!this.icon',
  },
})
export class SbbButton {
  /** Button modes available for different purposes. */
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'frameless' = 'primary';

  /**
   * Template that will contain icons.
   * Use the *sbbIcon structural directive to provide the desired icon.
   */
  @Input()
  get icon(): TemplateRef<any> {
    return this._contentIcon || this._icon;
  }
  set icon(icon: TemplateRef<any>) {
    this._icon = icon;
  }
  private _icon: TemplateRef<any>;

  /** @docs-private */
  @ContentChild(SbbIconDirective, { read: TemplateRef }) _contentIcon: TemplateRef<any>;

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'frameless'
    | string
    | null
    | undefined;
  // tslint:enable: member-ordering
}

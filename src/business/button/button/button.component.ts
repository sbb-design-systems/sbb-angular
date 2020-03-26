import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { BaseButton } from '@sbb-esta/angular-core/base';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent extends BaseButton {
  /**
   * Button modes available for different purposes.
   */
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'alternative' | 'icon' = 'primary';

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
  @HostBinding('class.sbb-button-has-icon') get buttonHasIconClass() {
    return !!this.icon;
  }

  /** @docs-private */
  @ContentChild(IconDirective, { read: TemplateRef })
  _contentIcon: TemplateRef<any>;

  /** @docs-private */
  @HostBinding('class.sbb-button-alternative')
  get _alternativeClass() {
    return this.mode === 'alternative';
  }

  /** @docs-private */
  @HostBinding('class.sbb-button-icon')
  get _iconClass() {
    return this.mode === 'icon';
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'alternative'
    | 'icon'
    | string
    | null
    | undefined;
  // tslint:enable: member-ordering
}

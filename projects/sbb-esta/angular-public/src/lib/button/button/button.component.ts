import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { ButtonIconDirective } from './button-icon.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
  /**
   * Button modes available for different purposes.
   */
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'frameless' = 'primary';

  /**
   * Template that will contain icons.
   * Use the *sbbButtonIcon structural directive to provide the desired icon.
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
  @HostBinding('class.sbb-button') buttonClass = true;

  /** @docs-private */
  @HostBinding('class.sbb-button-has-icon') get buttonHasIconClass() {
    return !!this.icon;
  }

  /** @docs-private */
  @ContentChild(ButtonIconDirective, { read: TemplateRef, static: false })
  _contentIcon: TemplateRef<any>;

  /** @docs-private */
  @HostBinding('class.sbb-button-primary')
  get _primaryClass() {
    return this.mode === 'primary';
  }

  /** @docs-private */
  @HostBinding('class.sbb-button-secondary')
  get _secondaryClass() {
    return this.mode === 'secondary';
  }

  /** @docs-private */
  @HostBinding('class.sbb-button-ghost')
  get _ghostClass() {
    return this.mode === 'ghost';
  }

  /** @docs-private */
  @HostBinding('class.sbb-button-frameless')
  get _framelessClass() {
    return this.mode === 'frameless';
  }
}

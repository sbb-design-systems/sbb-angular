import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
  OnChanges,
  Self,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { HostClass } from '../../_common/host-class';

import { ButtonIconDirective } from './button-icon.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [HostClass]
})
export class ButtonComponent implements OnChanges, AfterContentInit {
  /**
   * Button modes available for different purposes.
   */
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'frameless' = 'primary';

  /**
   * Template that will contain icons.
   * Use the *sbbButtonIcon structural directive to provide the desired icon.
   */
  @Input()
  @ContentChild(ButtonIconDirective, { read: TemplateRef })
  icon: TemplateRef<any>;

  /** @docs-private */
  @HostBinding('class.sbb-button') buttonClass = true;

  /** @docs-private */
  @HostBinding('class.sbb-button-has-icon') get buttonHasIconClass() {
    return !!this.icon;
  }

  constructor(@Self() private _hostClass: HostClass) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes.mode &&
        changes.mode.currentValue !== changes.mode.previousValue) ||
      (changes.icon && changes.icon.currentValue !== changes.icon.previousValue)
    ) {
      this._applyClass();
    }
  }

  ngAfterContentInit(): void {
    this._applyClass();
  }

  private _applyClass() {
    this._hostClass.apply(`sbb-button-${this.mode}`);
  }
}

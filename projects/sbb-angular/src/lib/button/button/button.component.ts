import {
  Component,
  ChangeDetectionStrategy,
  Input,
  TemplateRef,
  ContentChild,
  Self,
  OnChanges,
  AfterContentInit,
  SimpleChanges,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';

import { ButtonIconDirective } from './button-icon.directive';
import { HostClass } from '../../_common/host-class';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [HostClass],
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
  @Input() @ContentChild(ButtonIconDirective, { read: TemplateRef }) icon: TemplateRef<any>;

  /** @docs-private */
  @HostBinding('class.sbb-button') buttonClass = true;

  /** @docs-private */
  @HostBinding('class.sbb-button-has-icon') get buttonHasIconClass() { return !!this.icon; }

  constructor(
    @Self() private hostClass: HostClass,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.mode && changes.mode.currentValue !== changes.mode.previousValue)
      || (changes.icon && changes.icon.currentValue !== changes.icon.previousValue)) {
      this.applyClass();
    }
  }

  ngAfterContentInit(): void {
    this.applyClass();
  }

  private applyClass() {
    this.hostClass.apply(`sbb-button-${this.mode}`);
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  TemplateRef,
  ContentChild,
  Self,
  OnChanges,
  AfterContentInit,
  SimpleChanges
} from '@angular/core';

import { ButtonIconDirective } from './button-icon.directive';
import { HostClass } from '../../_common/host-class';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  constructor(
    @Self() private hostClass: HostClass,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.mode && changes.mode.currentValue !== changes.mode.previousValue)
      || (changes.icon && changes.icon.currentValue !== changes.icon.previousValue)) {
      this.applyClasses();
    }
  }

  ngAfterContentInit(): void {
    this.applyClasses();
  }

  private applyClasses() {
    const classes = {
      'sbb-button-has-icon': !!this.icon,
      [`sbb-button-${this.mode}`]: true,
    };
    this.hostClass.apply(classes);
  }
}

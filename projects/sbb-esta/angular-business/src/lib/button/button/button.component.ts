import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { BaseButton } from '../../../../../angular-public/src/lib/button/button/base-button';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: '../../../../../angular-public/src/lib/button/button/button.component.html',
  styleUrls: ['../../../../../angular-public/src/lib/button/button/button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent extends BaseButton {
  /**
   * Button modes available for different purposes.
   */
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'alternative' | 'icon' = 'primary';

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
}

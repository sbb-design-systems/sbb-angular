import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input, HostBinding,
  TemplateRef,
  ContentChild
} from '@angular/core';

import { ButtonIconDirective } from './button-icon.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

  /** 
   * Button modes available for different purposes.
   */
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'frameless' = 'primary';

   /** 
   * Template that will contain icons.
   */
  @Input() @ContentChild(ButtonIconDirective, { read: TemplateRef }) icon: TemplateRef<any>;

  @Input() class = '';
  @HostBinding('class') buttonModeClass: string;

  ngOnInit() {
    const hasIconClass = this.icon ? 'sbb-button-has-icon': '';
    this.buttonModeClass = `${this.class} sbb-button-${this.mode} ${hasIconClass}`;
  }

}

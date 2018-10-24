import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input, HostBinding,
  Type
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbButton], input[type=submit][sbbButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {
  @Input() mode: 'primary' | 'secondary' | 'ghost' | 'frameless' = 'primary';
  @Input() icon: Type<{}>;

  // tslint:disable-next-line:no-input-rename
  @Input('class') cssClassList = '';
  @HostBinding('class') buttonModeClass: string;

  ngOnInit() {
    const hasIconClass = this.icon ? 'sbb-button--has-icon': '';
    this.buttonModeClass = this.cssClassList + ` sbb-button--${this.mode} ${hasIconClass}`;
  }

}

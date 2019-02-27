import {
  Component,
  HostBinding,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ContentChild
} from '@angular/core';

import { DropdownComponent } from '../../dropdown/dropdown';

let counter = 0;

@Component({
  selector: 'sbb-usermenu',
  templateUrl: './usermenu.component.html',
  styleUrls: ['./usermenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {

  @HostBinding('class.sbb-usermenu') cssClass = true;

  @HostBinding() id = `sbb-usermenu-${counter++}`;

  @Input() displayName: string;

  @Input() userName: string;

  @Output() loginRequest = new EventEmitter<void>();

  @ContentChild(DropdownComponent) dropdown: DropdownComponent;

  emitLogIn() {
    this.loginRequest.emit();

  }

  getInitialLetters(): string {

    const names: string[] = this.userName.split(' ');

    if (this.userName) {

      if (names.length === 1) {

        return names[0].substring(0, 3).toLocaleUpperCase();
      }

      return names
        .reduce((current, next) => {
          return (current[0] + next[0]).toLocaleUpperCase();
        });
    }
  }

}

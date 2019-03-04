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

  /**
   * Css class of a sbb-usermenu.
   */
  @HostBinding('class.sbb-usermenu') cssClass = true;

  /**
   * Identifier of a usermenu.
   */
  @HostBinding() id = `sbb-usermenu-${counter++}`;

  /**
   * Name and surname of a user.
   */
  @Input() displayName: string;

  /**
   * Username of a user.
   */
  @Input() userName: string;

  /**
   * Event emitted on log in of a user.
   */
  @Output() loginRequest = new EventEmitter<void>();

  /**
   * Reference to a dropdown istance.
   */
  @ContentChild(DropdownComponent) dropdown: DropdownComponent;

  emitLogin() {
    this.loginRequest.emit();
  }

  /**
   * Get the initial letters of user's username.
   * @return Initial letters of user's username.
   */
  getInitialLetters(): string {

    const names: string[] = this.displayName.split(' ');

    if (this.displayName) {

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

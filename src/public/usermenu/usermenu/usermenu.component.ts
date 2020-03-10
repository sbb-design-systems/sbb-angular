import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { DropdownComponent } from '@sbb-esta/angular-public/dropdown';

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
   * It is optional.
   */
  @Input() displayName?: string;

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
   * Get the initial letters of user's displayName.
   * @return Initial letters of user's displayName.
   */
  getInitialLetters(): string {
    const name = this.displayName ? this.displayName : this.userName;
    const names: string[] = name.split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 3).toLocaleUpperCase();
    }

    return names
      .reduce((current, next) => {
        return current[0] + next[0];
      })
      .toLocaleUpperCase();
  }
}

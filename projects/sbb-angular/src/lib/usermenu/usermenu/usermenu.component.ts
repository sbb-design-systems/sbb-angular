import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  HostBinding,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { DropdownItemDirective } from '../../dropdown/dropdown-item.directive';
import { DropdownTriggerDirective } from '../../dropdown/dropdown';

let counter = 0;

@Component({
  selector: 'sbb-usermenu',
  templateUrl: './usermenu.component.html',
  styleUrls: ['./usermenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent implements AfterContentInit, AfterViewInit {

  @HostBinding('class.sbb-usermenu') cssClass = true;

  @HostBinding('attr.id') id = `sbb-usermenu-${counter++}`;

  @ContentChildren(DropdownItemDirective) items: QueryList<DropdownItemDirective>;

  @ViewChild(DropdownTriggerDirective) dropdownTrigger: DropdownTriggerDirective;

  @Input() displayName: string;

  @Input()
  set userName(value: string) {
    this._userName = value;
  }
  get userName(): string {
    return this._userName;
  }
  private _userName: string;

  get initialLetters(): string {
    return this.getInitialLetters();
  }

  @Output() eventLogin = new EventEmitter<string>();

  constructor(private el: ElementRef) { }

  ngAfterContentInit() {

  }

  ngAfterViewInit() {

  }

  emitLogIn() {
    this.eventLogin.emit('log in done');

  }

  getInitialLetters(): string {

    if (this.userName && this.userName.length !== 0) {
      return this.userName
        .split(' ')
        .reduce((namePart1, namePart2) => {
          return namePart1[0].toLocaleUpperCase() + namePart2[0].toLocaleUpperCase();
        });

    }
  }

}

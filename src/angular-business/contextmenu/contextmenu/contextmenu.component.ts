import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbDropdown, SbbDropdownTrigger } from '@sbb-esta/angular-business/dropdown';

@Component({
  selector: 'sbb-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css'],
  host: {
    class: 'sbb-contextmenu',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbContextmenu implements AfterContentInit {
  /** @docs-private */
  @ContentChild(SbbDropdown, { static: true }) _dropdown: SbbDropdown;
  /** @docs-private */
  @ViewChild(SbbDropdownTrigger, { static: true }) _dropdownTrigger: SbbDropdownTrigger;

  ngAfterContentInit(): void {
    this._dropdown.classList = 'sbb-contextmenu-dropdown';
    // Set the panel width
    this._dropdown.panelWidth = '227px';
    // Set the opened panel on the left
    this._dropdownTrigger.horizontalOrientation = 'prefer-left';
  }
}

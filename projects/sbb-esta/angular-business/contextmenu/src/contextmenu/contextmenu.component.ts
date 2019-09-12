import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DropdownComponent, DropdownTriggerDirective } from '@sbb-esta/angular-business/dropdown';

@Component({
  selector: 'sbb-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextmenuComponent implements AfterContentInit {
  /** @docs-private */
  @HostBinding('class.sbb-contextmenu') sbbClass = true;
  /** @docs-private */
  @ContentChild(DropdownComponent, { static: true }) _dropdown: DropdownComponent;
  /** @docs-private */
  @ViewChild(DropdownTriggerDirective, { static: true }) _dropdownTrigger: DropdownTriggerDirective;

  ngAfterContentInit(): void {
    this._dropdown.classList = 'sbb-contextmenu-dropdown';
    // Set the panel width
    this._dropdown.panelWidth = '227px';
    // Set the opened panel on the left
    this._dropdownTrigger.horizontalOrientation = 'prefer-left';
  }
}

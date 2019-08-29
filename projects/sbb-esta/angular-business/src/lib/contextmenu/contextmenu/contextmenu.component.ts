import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DropdownComponent, DropdownTriggerDirective } from '@sbb-esta/angular-public';
@Component({
  selector: 'sbb-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextmenuComponent implements AfterContentInit {
  /** @docs-private */
  @ContentChild(DropdownComponent, { static: true }) _dropdown: DropdownComponent;
  /** @docs-private */
  @ViewChild(DropdownTriggerDirective, { static: true }) _dropdownTrigger;
  ngAfterContentInit(): void {
    /**
     * Set the panel width
     */
    this._dropdown.panelWidth = '227px';
    /**
     * Set the opened panel on the left
     */
    this._dropdownTrigger.leftPositionPreferred = true;
  }
}

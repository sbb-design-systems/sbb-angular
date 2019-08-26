import {
  AfterContentInit,
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
  encapsulation: ViewEncapsulation.None
})
export class ContextmenuComponent implements OnInit, AfterContentInit {
  /**
   * Reference to a dropdown instance.
   */
  @ContentChild(DropdownComponent, { static: true }) dropdown: DropdownComponent;
  /**
   * Reference to a dropdown trigger directive instance.
   */
  @ViewChild(DropdownTriggerDirective, { static: true }) sbbDropdownDirective;

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    /**
     * Set the panel width
     */
    this.dropdown.panelWidth = '227px';
  }
}

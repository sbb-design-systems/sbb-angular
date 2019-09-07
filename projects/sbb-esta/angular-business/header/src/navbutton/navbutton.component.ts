import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  Optional,
  SkipSelf,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DropdownTriggerDirective } from '@sbb-esta/angular-business/dropdown';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbNavbutton]',
  templateUrl: './navbutton.component.html',
  styleUrls: ['../header/header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbuttonComponent implements AfterViewInit, OnDestroy {
  /** @docs-private */
  @HostBinding('class.sbb-navbutton') cssClass = true;

  /**
   * Button (or equivalent) component that navbutton wraps around.
   */
  @ViewChild('button', { static: true }) childButton: ElementRef;

  /**
   * Returns whether childButton's dropdown is expanded.
   */
  private _isDropdownExpanded = false;
  @HostBinding('class.sbb-navbutton-dropdown-expanded')
  get isDropdownExpanded() {
    return this._isDropdownExpanded;
  }

  /**
   * Css width to apply when the dropdown is opened.
   */
  dropdownWidth = '200px';

  /** @docs-private */
  private _subscriptions: Subscription[] = [];

  constructor(
    @SkipSelf() private _changeDetectorRef: ChangeDetectorRef,
    private _el: ElementRef,
    @Optional() private _dropdownTrigger: DropdownTriggerDirective
  ) {}

  ngAfterViewInit() {
    if (this._dropdownTrigger) {
      this._subscriptions = [
        this._dropdownTrigger.dropdown.opened.subscribe(() => this._toggleDropdown(true)),
        this._dropdownTrigger.dropdown.closed.subscribe(() => this._toggleDropdown(false))
      ];
    }
  }

  ngOnDestroy(): void {
    while (this._subscriptions.length) {
      this._subscriptions.shift().unsubscribe();
    }
  }

  /**
   * Returns whether childButton has a dropdown attached.
   */
  get isDropdown() {
    return this._el.nativeElement && this._el.nativeElement.getAttribute('role') === 'combobox';
  }

  /**
   * Will expand the dropdown panel and the button itself when the dropdown is opened.
   * @param expanded Whether the dropdown has been expanded or not
   */
  private _toggleDropdown(expanded: boolean) {
    if (this._dropdownTrigger) {
      this._isDropdownExpanded = expanded;
      this._el.nativeElement.style.width = expanded ? this.dropdownWidth : null;
      this._dropdownTrigger.dropdown.panelWidth = expanded ? this.dropdownWidth : null;

      if (expanded) {
        // This will update the panel with the new width
        this._dropdownTrigger.openPanel();
      }
      this._changeDetectorRef.detectChanges();
    }
  }
}

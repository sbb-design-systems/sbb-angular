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

/**
 * @deprecated
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[sbbNavbutton]',
  templateUrl: './navbutton.component.html',
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

  constructor(
    @SkipSelf() private _changeDetectorRef: ChangeDetectorRef,
    private _el: ElementRef,
    @Optional() private _dropdownTrigger: DropdownTriggerDirective
  ) {}

  ngAfterViewInit() {}

  ngOnDestroy(): void {}

  /**
   * Returns whether childButton has a dropdown attached.
   */
  get isDropdown() {
    return this._el.nativeElement && this._el.nativeElement.getAttribute('role') === 'combobox';
  }
}

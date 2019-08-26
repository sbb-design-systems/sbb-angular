import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'sbb-navbutton',
  templateUrl: './navbutton.component.html',
  styleUrls: ['./navbutton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbuttonComponent implements AfterViewInit, OnDestroy {
  /**
   * Css class of a sbb-navbutton
   */
  @HostBinding('class.sbb-navbutton') cssClass = true;

  /**
   * Button (or equivalent) component that navbutton wraps around.
   */
  @ViewChild('button', { static: true }) childButton: ElementRef;

  /**
   * Observer to detect when an eventual dropdown attached to childButton is expanded or collapsed.
   * Used to propagate change detection.
   */
  private _attributeObserver: MutationObserver;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this._checkChild();
    this._attributeObserver = new MutationObserver(() => this._changeDetectorRef.markForCheck());
    this._attributeObserver.observe(this._childNode, {
      attributes: true,
      attributeFilter: ['aria-expanded']
    });
  }

  ngOnDestroy(): void {
    if (this._attributeObserver) {
      this._attributeObserver.disconnect();
    }
  }

  /**
   * Returns whether childButton has a dropdown attached.
   */
  get isDropdown() {
    return this._childNode && this._childNode.getAttribute('role') === 'combobox';
  }

  /**
   * Returns whether childButton's dropdown is expanded.
   */
  get isDropdownExpanded() {
    return this._childNode && this._childNode.getAttribute('aria-expanded') === 'true';
  }

  /**
   * Returns a Node for the child element.
   */
  private get _childNode() {
    return this.childButton.nativeElement.children[0];
  }

  private _checkChild() {
    if (this.childButton.nativeElement.children.length !== 1) {
      throw Error('A child (and only one) is required for sbb-navbutton.');
    }
  }
}

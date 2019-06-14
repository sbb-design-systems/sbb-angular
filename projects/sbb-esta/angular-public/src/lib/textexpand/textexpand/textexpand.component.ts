// tslint:disable-next-line:max-line-length
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Output
} from '@angular/core';

import { TextexpandCollapsedComponent } from '../textexpand-collapsed/textexpand-collapsed.component';
import { TextexpandExpandedComponent } from '../textexpand-expanded/textexpand-expanded.component';

let counter = 0;

@Component({
  selector: 'sbb-textexpand',
  templateUrl: './textexpand.component.html',
  styleUrls: ['./textexpand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextexpandComponent implements AfterContentInit {
  /**
   * Describes if text content is expanded or not. Initially is collapsed.
   */
  isExpanded = false;

  /**
   * Identifier of the textexpand component.
   */
  @HostBinding('attr.id') id = `sbb-textexpand-${counter++}`;

  /**
   * Css class of the textexpand component.
   */
  @HostBinding('class.sbb-textexpand') cssClass = true;

  /**
   * Is an ARIA landmark role. It provide a way to identify a specific zone of the page.
   * Screen readers use landmark roles to provide keyboard navigation to important sections of a page.
   */
  @HostBinding('attr.role') role = 'region';

  /**
   * Is used to set the priority with which screen reader should treat updates to live regions.
   * With "polite" value the screen reader will speak changes whenever the user is idle.
   */
  @HostBinding('attr.aria-live') ariaLive = 'polite';

  /**
   * Event activated at the expansion of the text.
   */
  @Output() expandEvent = new EventEmitter<boolean>();

  /**
   * Refers to the textexpand-collapsed component istance.
   */
  @ContentChild(TextexpandCollapsedComponent, { static: true })
  collapsedComponent: TextexpandCollapsedComponent;

  /**
   * Refers to the textexpand-expanded component istance.
   */
  @ContentChild(TextexpandExpandedComponent, { static: true })
  expandedComponent: TextexpandExpandedComponent;

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.collapsedComponent.isHidden = !this.collapsedComponent.isHidden;
    this.expandedComponent.isHidden = !this.expandedComponent.isHidden;
    this.expandEvent.emit(this.isExpanded);
  }

  ngAfterContentInit() {
    if (!this.collapsedComponent || !this.expandedComponent) {
      throw new Error('Collapsed and expanded must be defined!');
    }
  }
}

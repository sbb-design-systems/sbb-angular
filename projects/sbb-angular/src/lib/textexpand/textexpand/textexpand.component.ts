// tslint:disable-next-line:max-line-length
import { Component, OnInit, HostBinding, Output, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, EventEmitter, ContentChild, AfterContentInit } from '@angular/core';
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

  isExpanded = false;

  @HostBinding('attr.id') id = `sbb-textexpand-${counter++}`;

  @HostBinding('class') cssClass = 'sbb-textexpand';

  @HostBinding('attr.role') role = 'region';

  @HostBinding('attr.aria-live') ariaLive = 'polite';

  @Output() expandEvent = new EventEmitter<boolean>();

  @ContentChild(TextexpandCollapsedComponent) collapsedComponent: TextexpandCollapsedComponent;

  @ContentChild(TextexpandExpandedComponent) expandedComponent: TextexpandExpandedComponent;


  toggleExpanded() {

    this.isExpanded = !this.isExpanded;
    this.collapsedComponent.visible = !this.collapsedComponent.visible;
    this.expandedComponent.visible = !this.expandedComponent.visible;
    this.expandEvent.emit(this.isExpanded);

  }

  ngAfterContentInit() {

    if (!this.collapsedComponent || !this.expandedComponent) {
      throw new Error('Collapsed and expand must be defined!');
    }

  }

}

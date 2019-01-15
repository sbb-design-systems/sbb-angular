import { Component, OnInit, HostBinding, Output, ChangeDetectionStrategy } from '@angular/core';
import { TextexpandCollapsedComponent } from '../textexpand-collapsed/textexpand-collapsed.component';
import { TextexpandExpandedComponent } from '../textexpand-expanded/textexpand-expanded.component';
import { EventEmitter, ContentChild, AfterContentInit } from '@angular/core';


@Component({
  selector: 'sbb-textexpand',
  templateUrl: './textexpand.component.html',
  styleUrls: ['./textexpand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextexpandComponent implements AfterContentInit {

  expanded = false;

  @HostBinding('class') cssClass = 'sbb-textexpand';

  @Output() expandEvent = new EventEmitter<boolean>();

  @ContentChild(TextexpandCollapsedComponent) collapsedComponent: TextexpandCollapsedComponent;
  @ContentChild(TextexpandExpandedComponent) expandedComponent: TextexpandCollapsedComponent;

  toggleExpanded() {

    this.expanded = !this.expanded;
    this.collapsedComponent.visible = !this.collapsedComponent.visible;
    this.expandedComponent.visible = !this.expandedComponent.visible;
    this.expandEvent.emit(this.expanded);

  }

  ngAfterContentInit() {

    if (!this.collapsedComponent || !this.expandedComponent) {
      throw new Error('Collapsed and expand must be defined!');
    }

  }



}

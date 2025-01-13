// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { _IdGenerator } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { SbbTextexpandCollapsed } from './textexpand-collapsed';
import { getSbbTextexpandInvalidError } from './textexpand-errors';
import { SbbTextexpandExpanded } from './textexpand-expanded';

@Component({
  selector: 'sbb-textexpand',
  exportAs: 'sbbTextexpand',
  templateUrl: './textexpand.html',
  styleUrls: ['./textexpand.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-textexpand',
    role: 'region',
    '[attr.id]': 'id',
    'aria-live': 'polite',
  },
})
export class SbbTextexpand implements AfterContentInit {
  _labelShowLess: string = $localize`:Button label for showing less@@sbbTextexpandShowLess:Show less`;

  _labelShowMore: string = $localize`:Button label for showing more@@sbbTextexpandShowMore:Show more`;

  /** Describes if text content is expanded or not. Initially is collapsed. */
  isExpanded: boolean = false;

  /** Identifier of the textexpand component. */
  @Input() id: string = inject(_IdGenerator).getId('sbb-textexpand-');

  /** Event activated at the expansion of the text. */
  @Output() expandEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Refers to the textexpand-collapsed component instance. */
  @ContentChild(SbbTextexpandCollapsed) collapsedComponent: SbbTextexpandCollapsed;

  /** Refers to the textexpand-expanded component instance. */
  @ContentChild(SbbTextexpandExpanded) expandedComponent: SbbTextexpandExpanded;

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.collapsedComponent._hidden = !this.collapsedComponent._hidden;
    this.expandedComponent._hidden = !this.expandedComponent._hidden;
    this.expandEvent.emit(this.isExpanded);
  }

  ngAfterContentInit() {
    if (
      (!this.collapsedComponent || !this.expandedComponent) &&
      (typeof ngDevMode === 'undefined' || ngDevMode)
    ) {
      throw getSbbTextexpandInvalidError();
    }
  }
}

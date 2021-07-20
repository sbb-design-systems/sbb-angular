import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { mixinVariant } from '@sbb-esta/angular/core';

import { SbbTextexpandCollapsed } from './textexpand-collapsed';
import { getSbbTextexpandInvalidError } from './textexpand-errors';
import { SbbTextexpandExpanded } from './textexpand-expanded';

// Boilerplate for applying mixins to SbbTextexpand.
// tslint:disable-next-line: naming-convention
const _SbbTextexpandBase = mixinVariant(class {});

let nextId = 0;

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
export class SbbTextexpand extends _SbbTextexpandBase implements AfterContentInit {
  /** Describes if text content is expanded or not. Initially is collapsed. */
  isExpanded: boolean = false;

  /** Identifier of the textexpand component. */
  @Input() id: string = `sbb-textexpand-${nextId++}`;

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

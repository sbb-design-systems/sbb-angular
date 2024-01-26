import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';

export type SbbNavigationPageChangeEvent = 'next' | 'previous';

@Component({
  selector: 'sbb-navigation',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'navigation',
  },
  standalone: true,
  imports: [SbbIcon],
})
export class SbbNavigation implements OnChanges {
  /** The next page descriptor. */
  @Input()
  nextPage: string | null = null;

  /** The previous page descriptor. */
  @Input()
  previousPage: string | null = null;

  /** This event can be used by parent components to handle events on page change. */
  @Output()
  pageChange: EventEmitter<SbbNavigationPageChangeEvent> =
    new EventEmitter<SbbNavigationPageChangeEvent>();

  ngOnChanges(changes: SimpleChanges) {
    if (!this.nextPage && !this.previousPage) {
      throw Error('At least hasNext or hasPrevious must be defined in <sbb-navigation>');
    }
  }
}

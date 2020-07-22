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

export type NavigationPageChangeEvent = 'next' | 'previous';

@Component({
  selector: 'sbb-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'attr.role': 'navigation',
  },
})
export class NavigationComponent implements OnChanges {
  /**
   * @docs-private
   * @deprecated internal detail
   */
  role = 'navigation';

  /** The next page descriptor. */
  @Input()
  nextPage: string | null = null;

  /** The previous page descriptor. */
  @Input()
  previousPage: string | null = null;

  /**
   * This event can be used by parent components to handle events on page change.
   */
  @Output()
  pageChange: EventEmitter<NavigationPageChangeEvent> = new EventEmitter<
    NavigationPageChangeEvent
  >();

  ngOnChanges(changes: SimpleChanges) {
    if (!this.nextPage && !this.previousPage) {
      throw Error('At least hasNext or hasPrevious must be defined in <sbb-navigation>');
    }
  }
}

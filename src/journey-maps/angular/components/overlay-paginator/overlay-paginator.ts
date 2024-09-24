import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sbb-overlay-paginator',
  templateUrl: './overlay-paginator.html',
  styleUrls: ['./overlay-paginator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SbbOverlayPaginator {
  @Input() index: number; // Starts with 0
  @Input() size: number;
  @Output() indexClicked: EventEmitter<number> = new EventEmitter<number>();

  hasPrevious(): boolean {
    return this.index > 0;
  }

  hasNext(): boolean {
    return this.index + 1 < this.size;
  }

  onIndexClicked(idx: number): void {
    if (idx !== this.index) {
      this.index = idx;
      this.indexClicked.next(idx);
    }
  }

  onPreviousClicked() {
    if (this.hasPrevious()) {
      this.indexClicked.next(--this.index);
    }
  }

  onNextClicked() {
    if (this.hasNext()) {
      this.indexClicked.next(++this.index);
    }
  }
}

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'rokas-overlay-paginator',
  templateUrl: './overlay-paginator.component.html',
  styleUrls: ['./overlay-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayPaginatorComponent {

  @Input() index: number; // Starts with 0
  @Input() size: number;
  @Output() indexClicked = new EventEmitter<number>();

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

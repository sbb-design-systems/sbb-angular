import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { SbbLeitPoiFeature } from './model/leit-poi-feature';

@Component({
  selector: 'sbb-leit-poi',
  templateUrl: './leit-poi.html',
  styleUrls: ['./leit-poi.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SbbLeitPoi {
  @Input() feature: SbbLeitPoiFeature = {} as SbbLeitPoiFeature;
  @Output() switchLevel: EventEmitter<number> = new EventEmitter<number>();

  onClick(): void {
    this.switchLevel?.emit(this.feature.destinationLevel);
  }
}

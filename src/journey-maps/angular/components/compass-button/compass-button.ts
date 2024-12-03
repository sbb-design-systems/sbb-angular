import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbLocaleService } from '../../services/locale-service';

@Component({
  selector: 'sbb-compass-button',
  templateUrl: './compass-button.html',
  styleUrls: ['./compass-button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SbbCompassButton implements OnInit {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;
  @Input() isDarkMode: boolean;
  @Input() negativeBearing: number;
  @Input() pitch: number;

  @Output() compassButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  compassButtonLabel: string;

  constructor(private _i18n: SbbLocaleService) {}

  ngOnInit(): void {
    this.compassButtonLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.compassButton',
    )}`;
  }

  onCompassButtonClicked(): void {
    this.compassButtonClicked.next();
  }
}

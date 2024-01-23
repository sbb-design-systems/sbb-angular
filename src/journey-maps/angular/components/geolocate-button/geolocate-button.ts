import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbStyleMode } from '../../journey-maps.interfaces';
import { SbbLocaleService } from '../../services/locale-service';

@Component({
  selector: 'sbb-geolocate-button',
  templateUrl: './geolocate-button.html',
  styleUrls: ['./geolocate-button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbGeolocateButton implements OnInit {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;
  @Input() styleMode: SbbStyleMode | undefined = 'bright';

  @Output() geolocateButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  get isDarkMode(): boolean {
    return !!this.styleMode && this.styleMode === 'dark';
  }

  geolocateButtonLabel: string;

  constructor(private _i18n: SbbLocaleService) {}

  ngOnInit(): void {
    this.geolocateButtonLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.geolocateButton',
    )}`;
  }

  onGeolocateButtonClicked(): void {
    this.geolocateButtonClicked.next();
  }
}

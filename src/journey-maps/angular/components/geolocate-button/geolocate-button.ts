import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbLocaleService } from '../../services/locale-service';

@Component({
  selector: 'sbb-geolocate-button',
  templateUrl: './geolocate-button.html',
  styleUrls: ['./geolocate-button.css'],
})
export class SbbGeolocateButton implements OnInit {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;

  @Output() geolocateButtonClicked: EventEmitter<void> = new EventEmitter<void>();

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
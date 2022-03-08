import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'rokas-basemap-switch',
  templateUrl: './basemap-switch.component.html',
  styleUrls: ['./basemap-switch.component.css'],
})
export class BasemapSwitchComponent implements OnInit {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;

  @Output() toggleBasemap: EventEmitter<void> = new EventEmitter<void>();

  basemapSwitchLabel: string;

  constructor(private _i18n: LocaleService) {}

  ngOnInit(): void {
    this.basemapSwitchLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.basemapSwitch'
    )}`;
  }

  doToggleBasemap(): void {
    this.toggleBasemap.next();
  }
}

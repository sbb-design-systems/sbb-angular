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
import { SbbDarkModeAware } from '../dark-mode-aware/dark-mode-aware';

@Component({
  selector: 'sbb-basemap-switch',
  templateUrl: './basemap-switch.html',
  styleUrls: ['./basemap-switch.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbBasemapSwitch extends SbbDarkModeAware implements OnInit {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;

  @Output() toggleBasemap: EventEmitter<void> = new EventEmitter<void>();

  basemapSwitchLabel: string;

  constructor(private _i18n: SbbLocaleService) {
    super();
  }

  ngOnInit(): void {
    this.basemapSwitchLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.basemapSwitch',
    )}`;
  }

  doToggleBasemap(): void {
    this.toggleBasemap.next();
  }
}

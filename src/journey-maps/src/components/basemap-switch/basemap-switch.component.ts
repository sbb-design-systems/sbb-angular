import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Map as MaplibreMap} from 'maplibre-gl';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'rokas-basemap-switch',
  templateUrl: './basemap-switch.component.html',
  styleUrls: ['./basemap-switch.component.scss']
})
export class BasemapSwitchComponent implements OnInit{

  @Input() map: MaplibreMap;
  @Input() showSmallButtons: boolean;

  @Output() toggleBasemap = new EventEmitter<void>();

  basemapSwitchLabel: string;

  constructor(private i18n: LocaleService) {}

  ngOnInit(): void {
    this.basemapSwitchLabel = `${this.i18n.getText('a4a.visualFunction')} ${this.i18n.getText('a4a.basemapSwitch')}`;
  }

  doToggleBasemap(): void {
    this.toggleBasemap.next();
  }
}

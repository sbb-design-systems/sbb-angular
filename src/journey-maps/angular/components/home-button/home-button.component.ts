import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'rokas-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.css'],
})
export class HomeButtonComponent implements OnInit {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;

  @Output() homeButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  homeButtonLabel: string;

  constructor(private _i18n: LocaleService) {}

  ngOnInit(): void {
    this.homeButtonLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.homeButton'
    )}`;
  }

  onHomeButtonClicked(): void {
    this.homeButtonClicked.next();
  }
}

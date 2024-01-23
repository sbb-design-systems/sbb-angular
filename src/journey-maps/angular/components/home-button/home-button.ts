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
  selector: 'sbb-home-button',
  templateUrl: './home-button.html',
  styleUrls: ['./home-button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbHomeButton extends SbbDarkModeAware implements OnInit {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;

  @Output() homeButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  homeButtonLabel: string;

  constructor(private _i18n: SbbLocaleService) {
    super();
  }

  ngOnInit(): void {
    this.homeButtonLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.homeButton',
    )}`;
  }

  onHomeButtonClicked(): void {
    this.homeButtonClicked.next();
  }
}

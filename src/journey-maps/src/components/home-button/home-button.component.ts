import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocaleService} from '../../services/locale.service';
import {Map as MaplibreMap} from 'maplibre-gl';

@Component({
  selector: 'rokas-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss']
})
export class HomeButtonComponent implements OnInit{

  @Input() map: MaplibreMap;
  @Input() showSmallButtons: boolean;

  @Output() homeButtonClicked = new EventEmitter<void>();

  homeButtonLabel: string;

  constructor(private i18n: LocaleService) {}

  ngOnInit(): void {
    this.homeButtonLabel = `${this.i18n.getText('a4a.visualFunction')} ${this.i18n.getText('a4a.homeButton')}`;
  }

  onHomeButtonClicked(): void {
    this.homeButtonClicked.next();
  }
}

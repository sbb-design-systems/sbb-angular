import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-attribution',
  template: '',
  styleUrls: ['./attribution.css'],
  encapsulation: ViewEncapsulation.None,
})

// Will be implemented with https://flow.sbb.ch/browse/ROKAS-90.
// At the moment we only override some of the maplibre styles.
export class SbbAttribution {}

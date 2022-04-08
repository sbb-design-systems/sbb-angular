import { Component } from '@angular/core';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps Basic Example
 */
@Component({
  selector: 'sbb-journey-maps-basic-example',
  templateUrl: 'journey-maps-basic-example.html',
  styleUrls: ['journey-maps-basic-example.css'],
})
export class JourneyMapsBasicExample {
  apiKey = window.JM_API_KEY;
}

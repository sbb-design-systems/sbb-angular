import { Component } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbJourneyMapsModule } from '@sbb-esta/journey-maps';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - Basic Example
 * @oder 1
 */
@Component({
  selector: 'sbb-journey-maps-basic-example',
  templateUrl: 'journey-maps-basic-example.html',
  styleUrls: ['journey-maps-basic-example.css'],
  standalone: true,
  imports: [SbbJourneyMapsModule, SbbNotificationModule],
})
export class JourneyMapsBasicExample {
  apiKey = window.JM_API_KEY;
}

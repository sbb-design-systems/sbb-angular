import { SbbJourneyMaps } from '@sbb-esta/journey-maps/angular';

function addMarkers(client: SbbJourneyMapsElement) {
  client.markerOptions = {
    popup: false,
    markers: [
      {
        id: 'velo',
        title: 'Basel - Bahnhof SBB',
        subtitle: 'Rent a Bike - Ihr Mietvelo',
        position: [7.5897, 47.5476],
        category: 'BIKE-PROFILE-SIGN-PARKING',
      },
      {
        id: 'work',
        title: 'Office',
        subtitle: 'SBB Wylerpark',
        position: [7.44645, 46.961409],
        category: 'MISSED-CONNECTION',
      },
    ],
  };
  client.listenerOptions = {
    MARKER: { watch: true },
  };

  return client;
}

function addEventListeners(client: HTMLElement & SbbJourneyMaps) {
  client.addEventListener('zoomLevelsChange', (event: Event) => {
    if (!isCustomEvent(event)) {
      throw new Error('Illegal event type');
    }

    console.log('Current zoom: ', event.detail.currentZoom);
  });
}

function createSbbJourneyMapsElement() {
  const client = document.createElement('sbb-journey-maps-wc') as SbbJourneyMapsElement;
  client.language = 'en';
  client.apiKey = window.JM_API_KEY;

  addMarkers(client);
  addEventListeners(client);

  return client;
}

function isCustomEvent(event: Event): event is CustomEvent {
  return 'detail' in event;
}

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

type SbbJourneyMapsElement = HTMLElement & SbbJourneyMaps;

// Add custom element to DOM
document.addEventListener('DOMContentLoaded', () =>
  document.getElementById('container')!.appendChild(createSbbJourneyMapsElement())
);

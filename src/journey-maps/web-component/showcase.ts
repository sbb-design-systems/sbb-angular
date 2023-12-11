import {
  SbbFeatureData,
  SbbFeaturesClickEventData,
  SbbJourneyMaps,
} from '@sbb-esta/journey-maps/angular';

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

function addClickListener(client: HTMLElement & SbbJourneyMaps) {
  client.addEventListener('featuresClick', (event) => {
    if (isCustomEvent(event)) {
      const detail: SbbFeaturesClickEventData = event.detail;
      const feature = detail.features?.[0];
      switch (feature?.featureDataType) {
        case 'MARKER':
          updateMarkerDetailsTemplate(feature);
          break;
        case 'STATION':
          updateStationTemplate(feature);
          break;
        case 'POI':
          updatePoiTemplate(feature);
          break;
      }
    }
  });
}

function createMarkerDetailsTemplate(client: SbbJourneyMapsElement) {
  const template = document.createElement('template');
  template.id = 'markerDetailsTemplate';

  client.markerDetailsTemplate = template.id;
  document.getElementById('main')!.appendChild(template);
}

function createStationTemplate(client: SbbJourneyMapsElement) {
  const template = document.createElement('template');
  template.id = 'stationTemplate';

  client.listenerOptions = {
    ...client.listenerOptions,
    STATION: { watch: true, popup: true, clickTemplate: template.id, selectionMode: 'single' },
  };
  document.getElementById('main')!.appendChild(template);
}

function createPoiTemplate(client: SbbJourneyMapsElement) {
  const template = document.createElement('template');
  template.id = 'poiTemplate';

  client.poiOptions = {
    categories: [
      'park_rail',
      'car_sharing',
      'p2p_car_sharing',
      'bike_parking',
      'bike_sharing',
      'on_demand',
    ],
  };
  client.listenerOptions = {
    ...client.listenerOptions,
    POI: { watch: true, popup: true, clickTemplate: template.id, selectionMode: 'single' },
  };
  document.getElementById('main')!.appendChild(template);
}

function updateMarkerDetailsTemplate(marker: SbbFeatureData) {
  const template = document.getElementById('markerDetailsTemplate')!;
  template.innerHTML = `
    <div>
      <div>${marker.properties?.title}</div>
      <div>${marker.properties?.subtitle}</div>
    </div>
  `;
}

function updateStationTemplate(station: SbbFeatureData) {
  const template = document.getElementById('stationTemplate')!;
  template.innerHTML = `
    <div>
      <div>${station.properties?.name}</div>
      <div>${station.properties?.uic_ref}</div>
    </div>
  `;
}

function updatePoiTemplate(poi: SbbFeatureData) {
  const template = document.getElementById('poiTemplate')!;
  template.innerHTML = `
    <div>
      <div>${poi.properties?.name}</div>
      <div>${poi.properties?.sbbId}</div>
    </div>
  `;
}

function createSbbJourneyMapsElement() {
  const client = document.createElement('sbb-journey-maps-wc') as SbbJourneyMapsElement;
  client.language = 'en';
  client.apiKey = window.JM_API_KEY;

  addMarkers(client);
  createMarkerDetailsTemplate(client);
  createStationTemplate(client);
  createPoiTemplate(client);
  addClickListener(client);

  document.getElementById('container')!.appendChild(client);
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
document.addEventListener('DOMContentLoaded', () => {
  createSbbJourneyMapsElement();
});

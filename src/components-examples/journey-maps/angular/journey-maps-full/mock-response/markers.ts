import { MarkerCategory, MarkerOptions } from '@sbb-esta/journey-maps';

export const markers: MarkerOptions = {
  popup: true,
  zoomToMarkers: true,
  markers: [
    {
      id: 'velo',
      title: 'Basel - Bahnhof SBB',
      subtitle: 'Rent a Bike - Ihr Mietvelo',
      position: [7.5897, 47.5476],
      category: MarkerCategory.BICYCLEPARKING,
      color: 'BLACK',
    },
    {
      id: 'biel',
      title: 'Biel, my town, my rules !',
      position: [7.2468, 47.1368],
      category: MarkerCategory.DISRUPTION,
      color: 'RED',
      markerUrl: 'https://www.biel-bienne.ch/',
      triggerEvent: false,
    },
    {
      id: 'work',
      title: 'Office',
      subtitle: 'SBB Wylerpark',
      position: [7.44645, 46.961409],
      category: MarkerCategory.RAIL,
      color: 'DARKBLUE',
    },
    {
      id: 'work2',
      title: 'Office2',
      subtitle: 'SBB Wylerpark2',
      position: [7.44649, 46.961409],
      category: MarkerCategory.RAIL,
      color: 'DARKBLUE',
    },
  ],
};

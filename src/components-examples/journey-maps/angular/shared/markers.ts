import { SbbMarker, SbbMarkerCategory } from '@sbb-esta/journey-maps';

export const markers: SbbMarker[] = [
  {
    id: 'velo',
    title: 'Basel - Bahnhof SBB',
    subtitle: 'Rent a Bike - Ihr Mietvelo',
    position: [7.5897, 47.5476],
    category: SbbMarkerCategory.BICYCLEPARKING,
    color: 'BLACK',
  },
  {
    id: 'biel',
    title: 'Biel, my town, my rules !',
    position: [7.2468, 47.1368],
    category: SbbMarkerCategory.DISRUPTION,
    color: 'RED',
    markerUrl: 'https://www.biel-bienne.ch/',
    triggerEvent: false,
  },
  {
    id: 'work',
    title: 'Office',
    subtitle: 'SBB Wylerpark',
    position: [7.44645, 46.961409],
    category: SbbMarkerCategory.RAIL,
    color: 'DARKBLUE',
  },
  {
    id: 'work2',
    title: 'Office2',
    subtitle: 'SBB Wylerpark2',
    position: [7.44649, 46.961409],
    category: SbbMarkerCategory.RAIL,
    color: 'DARKBLUE',
  },
];

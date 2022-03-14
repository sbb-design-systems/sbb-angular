import { MarkerCategory, MarkerColor } from '@sbb-esta/journey-maps';

export const markers = {
  popup: true,
  markers: [
    {
      id: 'velo',
      title: 'Basel - Bahnhof SBB',
      subtitle: 'Rent a Bike - Ihr Mietvelo',
      position: [7.5897, 47.5476],
      category: MarkerCategory.BICYCLEPARKING,
      color: MarkerColor.BLACK,
    },
    {
      id: 'home',
      title: 'Home Office',
      subtitle: 'My home is my castle',
      position: [7.296515, 47.069815],
      category: MarkerCategory.WARNING,
      color: MarkerColor.RED,
    },
    {
      id: 'biel',
      title: 'Biel, my town, my rules !',
      position: [7.2468, 47.1368],
      category: MarkerCategory.DISRUPTION,
      color: MarkerColor.RED,
      markerUrl: 'https://www.biel-bienne.ch/',
      triggerEvent: false,
    },
    {
      id: 'playground',
      title: 'Playground',
      subtitle: 'Sun, fun and nothing to do',
      position: [7.299265, 47.07212],
      category: MarkerCategory.CUSTOM,
      icon: 'assets/icons/train.png',
      iconSelected: 'assets/icons/train_selected.png',
    },
    {
      id: 'work',
      title: 'Office',
      subtitle: 'SBB Wylerpark',
      position: [7.44645, 46.961409],
      category: MarkerCategory.RAIL,
      color: MarkerColor.DARKBLUE,
    },
    {
      id: 'work2',
      title: 'Office2',
      subtitle: 'SBB Wylerpark2',
      position: [7.44649, 46.961409],
      category: MarkerCategory.RAIL,
      color: MarkerColor.DARKBLUE,
    },
  ],
};

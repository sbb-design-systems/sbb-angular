import { SbbJourneyMapsRoutingOptions } from '@sbb-esta/journey-maps';
import { LngLatBoundsLike } from 'maplibre-gl';

import { beSh } from './journey/be-sh';
import { zhBeWyleregg } from './journey/zh-be_wyleregg';
import { zhShWaldfriedhof } from './journey/zh-sh_waldfriedhof';
import { bielLyssRoutes, bielLyssRoutesOptions } from './routes/biel-lyss';
import { bnLsRoutes, bnLsRoutesOptions } from './routes/bn-ls';
import { bernIndoor } from './transfer/bern-indoor';
import { geneveIndoor } from './transfer/geneve-indoor';
import { luzern4j } from './transfer/luzern4-j';
import { zurichIndoor } from './transfer/zurich-indoor';
import { bernBurgdorfZones } from './zone/bern-burgdorf';
import { baselBielZones } from './zone/bs-bl';

export const RAIL_COLORS = [
  { label: 'default' },
  { label: 'hide', value: 'transparent' },
  {
    label: 'silver',
    value: 'rgba(220,220,220,1)',
  },
  { label: 'blue', value: 'rgba(45,50,125,1)' },
  { label: 'lemon', value: 'rgba(255,222,21,1)' },
  {
    label: 'violet',
    value: 'rgba(111,34,130,1)',
  },
];

export const STYLE_IDS = {
  v1: { brightId: 'base_bright_v2_ki', darkId: 'base_dark_v2_ki' },
  v2: { brightId: 'base_bright_v2_ki_v2', darkId: 'base_dark_v2_ki_v2' },
};

export const CH_BOUNDS: LngLatBoundsLike = [
  [5.7349, 45.6755],
  [10.6677, 47.9163],
];

export const POI_CATEGORIES = [
  'park_rail',
  'car_sharing',
  'p2p_car_sharing',
  'bike_parking',
  'bike_sharing',
  'on_demand',
];

export const JOURNEY_MAPS_DEFAULT_ZONE_OPTIONS = [
  { label: '(none)', value: undefined },
  { label: 'Berne / Burgdorf', value: bernBurgdorfZones },
  { label: 'Basel / Biel', value: baselBielZones },
];
export const JOURNEY_MAPS_DEFAULT_ROUTING_OPTIONS: {
  label: string;
  value: SbbJourneyMapsRoutingOptions | undefined;
}[] = [
  { label: '(none)', value: undefined },
  {
    label: 'Zürich - Bern, Wyleregg',
    value: { journey: zhBeWyleregg },
  },
  {
    label: 'Zürich - Schaffhausen, Waldfriedhof',
    value: { journey: zhShWaldfriedhof },
  },
  {
    label: 'Bern - Schaffhausen',
    value: { journey: beSh },
  },
  {
    label: 'Bern - Lausanne',
    value: {
      routes: bnLsRoutes,
      routesMetaInformations: bnLsRoutesOptions,
    },
  },
  {
    label: 'Biel - Lyss',
    value: {
      routes: bielLyssRoutes,
      routesMetaInformations: bielLyssRoutesOptions,
    },
  },
  { label: 'Transfer Bern', value: { transfer: bernIndoor } },
  { label: 'Transfer Genf', value: { transfer: geneveIndoor } },
  { label: 'Transfer Luzern', value: { transfer: luzern4j } },
  { label: 'Transfer Zürich', value: { transfer: zurichIndoor } },
];

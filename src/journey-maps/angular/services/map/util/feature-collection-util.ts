import { Feature, FeatureCollection } from 'geojson';

export const toFeatureCollection = (features: Feature[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features,
});

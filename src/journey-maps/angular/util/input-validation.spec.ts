import { SBB_EMPTY_FEATURE_COLLECTION } from '../services/map/map-service';

import { getInvalidRoutingOptionCombination } from './input-validation';

describe('getInvalidKeyCombination()', () => {
  it('returns empty array', () => {
    expect(getInvalidRoutingOptionCombination({}).length).toBe(0);

    expect(
      getInvalidRoutingOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
        tripMetaInformation: { selectedLegId: '' },
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        routesMetaInformations: [],
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
        tripMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        trip: undefined,
        tripMetaInformation: undefined,
        routes: [],
        routesMetaInformations: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        trip: undefined,
        tripMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
      }),
    ).toEqual([]);
  });

  it('returns non-empty array', () => {
    expect(
      getInvalidRoutingOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      }),
    ).toEqual(['trip', 'routes']);

    expect(
      getInvalidRoutingOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        trip: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual(['routes', 'trip']);

    expect(
      getInvalidRoutingOptionCombination({
        trip: undefined,
        tripMetaInformation: { selectedLegId: '' },
      }),
    ).toEqual(['tripMetaInformation']);

    expect(
      getInvalidRoutingOptionCombination({
        routes: undefined,
        routesMetaInformations: [],
      }),
    ).toEqual(['routesMetaInformations']);
  });
});

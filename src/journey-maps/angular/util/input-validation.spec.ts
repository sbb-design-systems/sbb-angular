import { SBB_EMPTY_FEATURE_COLLECTION } from '../services/map/map-service';

import { getInvalidRoutingOptionCombination } from './input-validation';

describe('getInvalidKeyCombination()', () => {
  it('returns empty array', () => {
    expect(getInvalidRoutingOptionCombination({}).length).toBe(0);

    expect(
      getInvalidRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        journeyMetaInformation: { selectedLegId: '' },
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
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        journeyMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
        transfer: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        journey: undefined,
        journeyMetaInformation: undefined,
        routes: [],
        routesMetaInformations: undefined,
        transfer: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidRoutingOptionCombination({
        journey: undefined,
        journeyMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

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
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      }),
    ).toEqual(['journey', 'routes']);

    expect(
      getInvalidRoutingOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual(['routes', 'transfer']);

    expect(
      getInvalidRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual(['journey', 'transfer']);

    expect(
      getInvalidRoutingOptionCombination({
        journey: undefined,
        journeyMetaInformation: { selectedLegId: '' },
      }),
    ).toEqual(['journeyMetaInformation']);

    expect(
      getInvalidRoutingOptionCombination({
        routes: undefined,
        routesMetaInformations: [],
      }),
    ).toEqual(['routesMetaInformations']);

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
  });
});

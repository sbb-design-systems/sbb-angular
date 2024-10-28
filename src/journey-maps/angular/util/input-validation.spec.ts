import { SBB_EMPTY_FEATURE_COLLECTION } from '../services/map/map-service';

import {
  getInvalidJourneyMapsRoutingOptionCombination,
  getInvalidJourneyRoutesOptionCombination,
} from './input-validation';

describe('getInvalidKeyCombination()', () => {
  it('returns empty array', () => {
    expect(getInvalidJourneyMapsRoutingOptionCombination({}).length).toBe(0);
    expect(getInvalidJourneyRoutesOptionCombination({}).length).toBe(0);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        journeyMetaInformation: { selectedLegId: '' },
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        routesMetaInformations: [],
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        journeyMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
        transfer: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: undefined,
        journeyMetaInformation: undefined,
        routes: [],
        routesMetaInformations: undefined,
        transfer: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: undefined,
        journeyMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
        tripMetaInformation: { selectedLegId: '' },
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
        tripMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        trip: undefined,
        tripMetaInformation: undefined,
        routes: [],
        routesMetaInformations: undefined,
      }),
    ).toEqual([]);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        trip: undefined,
        tripMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
      }),
    ).toEqual([]);
  });

  it('returns non-empty array', () => {
    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      }),
    ).toEqual(['journey', 'routes']);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual(['routes', 'transfer']);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual(['journey', 'transfer']);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        journey: undefined,
        journeyMetaInformation: { selectedLegId: '' },
      }),
    ).toEqual(['journeyMetaInformation']);

    expect(
      getInvalidJourneyMapsRoutingOptionCombination({
        routes: undefined,
        routesMetaInformations: [],
      }),
    ).toEqual(['routesMetaInformations']);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        routes: undefined,
        routesMetaInformations: [],
      }),
    ).toEqual(['routesMetaInformations']);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        trip: SBB_EMPTY_FEATURE_COLLECTION,
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      }),
    ).toEqual(['trip', 'routes']);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        trip: SBB_EMPTY_FEATURE_COLLECTION,
      }),
    ).toEqual(['routes', 'trip']);

    expect(
      getInvalidJourneyRoutesOptionCombination({
        trip: undefined,
        tripMetaInformation: { selectedLegId: '' },
      }),
    ).toEqual(['tripMetaInformation']);
  });
});

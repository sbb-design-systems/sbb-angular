import { SBB_EMPTY_FEATURE_COLLECTION } from '../services/map/map-service';

import { getInvalidOptionCombination } from './input-validation';

describe('getInvalidKeyCombination()', () => {
  it('returns empty array', () => {
    expect(getInvalidOptionCombination({}).length).toBe(0);

    expect(
      getInvalidOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
      }).length
    ).toBe(0);

    expect(
      getInvalidOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        journeyMetaInformation: { selectedLegId: '' },
      }).length
    ).toBe(0);

    expect(
      getInvalidOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      }).length
    ).toBe(0);

    expect(
      getInvalidOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        routesMetaInformations: [],
      }).length
    ).toBe(0);

    expect(
      getInvalidOptionCombination({
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }).length
    ).toBe(0);

    expect(
      getInvalidOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        journeyMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
        transfer: undefined,
      }).length
    ).toBe(0);

    expect(
      getInvalidOptionCombination({
        journey: undefined,
        journeyMetaInformation: undefined,
        routes: [],
        routesMetaInformations: undefined,
        transfer: undefined,
      }).length
    ).toBe(0);

    expect(
      getInvalidOptionCombination({
        journey: undefined,
        journeyMetaInformation: undefined,
        routes: undefined,
        routesMetaInformations: undefined,
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      }).length
    ).toBe(0);
  });

  it('returns non-empty array', () => {
    expect(
      getInvalidOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
      })
    ).toEqual(['journey', 'routes']);

    expect(
      getInvalidOptionCombination({
        routes: [SBB_EMPTY_FEATURE_COLLECTION],
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      })
    ).toEqual(['routes', 'transfer']);

    expect(
      getInvalidOptionCombination({
        journey: SBB_EMPTY_FEATURE_COLLECTION,
        transfer: SBB_EMPTY_FEATURE_COLLECTION,
      })
    ).toEqual(['journey', 'transfer']);

    expect(
      getInvalidOptionCombination({
        journey: undefined,
        journeyMetaInformation: { selectedLegId: '' },
      })
    ).toEqual(['journeyMetaInformation']);

    expect(
      getInvalidOptionCombination({
        routes: undefined,
        routesMetaInformations: [],
      })
    ).toEqual(['routesMetaInformations']);
  });
});

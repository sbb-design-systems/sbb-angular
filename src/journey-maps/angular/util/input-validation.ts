import { SbbJourneyMapsRoutingOptions, SbbJourneyRoutesOptions } from '../journey-maps.interfaces';

export const getInvalidJourneyMapsRoutingOptionCombination = (
  routingOptions: SbbJourneyMapsRoutingOptions,
): string[] => {
  const nonEmptyOptions = Object.entries(routingOptions).filter(([_, value]) => value);

  const nbOfOptions = nonEmptyOptions.length;

  const isValid =
    nbOfOptions === 0 ||
    (nbOfOptions === 1 &&
      (!!routingOptions.journey || !!routingOptions.routes || !!routingOptions.transfer)) ||
    (nbOfOptions === 2 &&
      ((!!routingOptions.journey && !!routingOptions.journeyMetaInformation) ||
        (!!routingOptions.routes && !!routingOptions.routesMetaInformations)));

  return isValid ? [] : nonEmptyOptions.map(([key, _]) => key);
};

export const getInvalidJourneyRoutesOptionCombination = (
  routingOptions: SbbJourneyRoutesOptions,
): string[] => {
  const nonEmptyOptions = Object.entries(routingOptions).filter(([_, value]) => value);

  const nbOfOptions = nonEmptyOptions.length;

  const isValid =
    nbOfOptions === 0 ||
    (nbOfOptions === 1 && (!!routingOptions.trip || !!routingOptions.routes)) ||
    (nbOfOptions === 2 &&
      ((!!routingOptions.trip && !!routingOptions.tripMetaInformation) ||
        (!!routingOptions.routes && !!routingOptions.routesMetaInformations)));

  return isValid ? [] : nonEmptyOptions.map(([key, _]) => key);
};

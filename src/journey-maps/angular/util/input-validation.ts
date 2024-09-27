import { SbbJourneyRoutesOptions } from '../journey-maps.interfaces';

export const getInvalidRoutingOptionCombination = (
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

import { SbbJourneyMapsRoutingOptions, SbbJourneyRoutesOptions } from '../journey-maps.interfaces';

export const getInvalidRoutingOptionCombination = (
  routingOptions: SbbJourneyMapsRoutingOptions & SbbJourneyRoutesOptions,
): string[] => {
  const nonEmptyOptions = Object.entries(routingOptions).filter(([_, value]) => value);

  const nbOfOptions = nonEmptyOptions.length;

  const isValid =
    nbOfOptions === 0 ||
    (nbOfOptions === 1 &&
      (!!routingOptions.journey ||
        !!routingOptions.routes ||
        !!routingOptions.transfer ||
        !!routingOptions.trip)) ||
    (nbOfOptions === 2 &&
      ((!!routingOptions.journey && !!routingOptions.journeyMetaInformation) ||
        (!!routingOptions.routes && !!routingOptions.routesMetaInformations) ||
        (!!routingOptions.trip && !!routingOptions.tripMetaInformation)));

  return isValid ? [] : nonEmptyOptions.map(([key, _]) => key);
};

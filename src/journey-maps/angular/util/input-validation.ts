import { SbbJourneyMapsRoutingOptions } from '../journey-maps.interfaces';

export const getInvalidRoutingOptionCombination = (
  routingOptions: SbbJourneyMapsRoutingOptions = {}
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

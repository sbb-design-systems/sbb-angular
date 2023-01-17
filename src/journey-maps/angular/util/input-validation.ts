import { SbbJourneyMapsRoutingOptions } from '../journey-maps.interfaces';

export const getInvalidOptionCombination = (
  routingOptions: SbbJourneyMapsRoutingOptions = {}
): string[] => {
  const nonEmptyOptions = Object.entries(routingOptions).filter(([_, value]) => value);

  const nbOfOptions = nonEmptyOptions.length;

  const isValid =
    nbOfOptions === 0 ||
    (nbOfOptions === 1 &&
      (!!routingOptions.journey || !!routingOptions.routes || !!routingOptions.transfer)) ||
    (nbOfOptions === 2 &&
      ((!!routingOptions.routes && !!routingOptions.routesMetaInformations) ||
        (!!routingOptions.journey && !!routingOptions.journeyMetaInformation)));

  return isValid ? [] : nonEmptyOptions.map(([key, _]) => key);
};

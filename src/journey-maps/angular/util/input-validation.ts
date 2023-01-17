import { SbbJourneyMapsRoutingOptions } from '@sbb-esta/journey-maps/angular';

export const getInvalidOptionCombination = (
  routingOptions: SbbJourneyMapsRoutingOptions = {}
): string[] => {
  const nonEmptyOptions = Object.entries(routingOptions).filter(([key, value]) => value);

  const nbOfOptions = nonEmptyOptions.length;

  const isValid =
    nbOfOptions === 0 ||
    (nbOfOptions === 1 &&
      !routingOptions.routesMetaInformations &&
      !routingOptions.journeyMetaInformation) ||
    (nbOfOptions === 2 &&
      ((!!routingOptions.routes && !!routingOptions.routesMetaInformations) ||
        (!!routingOptions.journey && !!routingOptions.journeyMetaInformation)));

  return isValid ? [] : nonEmptyOptions.map(([key, value]) => key);
};

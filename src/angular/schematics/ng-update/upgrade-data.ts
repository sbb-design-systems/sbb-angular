import { UpgradeData } from '@angular/cdk/schematics';

import {
  attributeSelectors,
  classNames,
  constructorChecks,
  cssSelectors,
  elementSelectors,
  inputNames,
  methodCallChecks,
  outputNames,
  propertyNames,
  symbolRemoval,
} from './data';
import { cssTokens } from './data/css-tokens';

/** Upgrade data that will be used for the SBB Angular ng-update schematic. */
export const sbbAngularUpgradeData: UpgradeData = {
  attributeSelectors,
  classNames,
  constructorChecks,
  cssSelectors,
  cssTokens,
  elementSelectors,
  inputNames,
  methodCallChecks,
  outputNames,
  propertyNames,
  symbolRemoval,
};

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

/** Upgrade data that will be used for the SBB Angular ng-update schematic. */
export const sbbAngularUpgradeData: UpgradeData = {
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
};

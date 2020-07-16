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
} from './data';

/** Upgrade data that will be used for the sbb-angular ng-update schematic. */
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
};

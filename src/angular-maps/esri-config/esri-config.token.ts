import { InjectionToken } from '@angular/core';

import { SbbEsriConfiguration } from './esri-configuration';

export const SBB_ESRI_CONFIG_TOKEN = new InjectionToken<SbbEsriConfiguration>('esri.config');

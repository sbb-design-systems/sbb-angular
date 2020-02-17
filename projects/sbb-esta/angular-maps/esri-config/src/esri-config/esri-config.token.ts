import { InjectionToken } from '@angular/core';

import { EsriConfiguration } from './esri-configuration';

export const ESRI_CONFIG_TOKEN = new InjectionToken<EsriConfiguration>('esri.config');

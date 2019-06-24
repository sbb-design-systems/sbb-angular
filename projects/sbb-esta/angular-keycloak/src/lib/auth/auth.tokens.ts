import { InjectionToken } from '@angular/core';
import { KeycloakInitOptions } from 'keycloak-js';

import { KeycloakConfig } from './keycloak-config';

export const KEYCLOAK_OPTIONS = new InjectionToken<KeycloakInitOptions>('keycloak.options');
export const KEYCLOAK_LOGIN_OPTIONS = new InjectionToken<string | KeycloakConfig>(
  'keycloak.loginOptions'
);
export const KEYCLOAK_CONFIG = new InjectionToken<string | KeycloakConfig>('keycloak.config');

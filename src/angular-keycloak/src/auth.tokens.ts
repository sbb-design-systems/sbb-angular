import { InjectionToken } from '@angular/core';
import { KeycloakInitOptions } from 'keycloak-js';

import { KeycloakConfig } from './keycloak-config';

/**
 * @deprecated Use the angular-oauth2-oidc package.
 */
export const KEYCLOAK_OPTIONS = new InjectionToken<KeycloakInitOptions>('keycloak.options');

/**
 * @deprecated Use the angular-oauth2-oidc package.
 */
export const KEYCLOAK_LOGIN_OPTIONS = new InjectionToken<string | KeycloakConfig>(
  'keycloak.loginOptions'
);

/**
 * @deprecated Use the angular-oauth2-oidc package.
 */
export const KEYCLOAK_CONFIG = new InjectionToken<string | KeycloakConfig>('keycloak.config');

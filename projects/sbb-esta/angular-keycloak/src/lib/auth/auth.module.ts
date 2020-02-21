import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { KeycloakInitOptions, KeycloakLoginOptions } from 'keycloak-js';

import { authInit } from './auth.init';
import { AuthService } from './auth.service';
import { KEYCLOAK_CONFIG, KEYCLOAK_LOGIN_OPTIONS, KEYCLOAK_OPTIONS } from './auth.tokens';
import { KeycloakConfig } from './keycloak-config';

@NgModule()
export class AuthModule {
  /**
   * Configure keycloak via available parameters.
   * @param config A config object or an url to the config json.
   * @param options An options object. Defaults to { onLoad: 'check-sso', flow: 'implicit' }.
   * @param loginOptions An object for login options. Defaults to { idpHint: 'azure_sbb_prod' }.
   *  To avoid configuring an idpHint, provide an object with no idpHint key.
   */
  static forRoot(
    config: string | KeycloakConfig,
    options: KeycloakInitOptions = { onLoad: 'check-sso', flow: 'implicit' },
    loginOptions: KeycloakLoginOptions = { idpHint: 'azure_sbb_prod' }
  ): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: KEYCLOAK_CONFIG, useValue: config },
        { provide: KEYCLOAK_OPTIONS, useValue: options },
        { provide: KEYCLOAK_LOGIN_OPTIONS, useValue: loginOptions },
        {
          provide: APP_INITIALIZER,
          useFactory: authInit,
          multi: true,
          deps: [KEYCLOAK_OPTIONS, KEYCLOAK_CONFIG, AuthService]
        }
      ]
    };
  }
}

import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { KeycloakInstance, KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';
import { from, Observable, of } from 'rxjs';

import { KEYCLOAK_LOGIN_OPTIONS } from './auth.tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  keycloak: KeycloakInstance;

  constructor(
    @Inject(KEYCLOAK_LOGIN_OPTIONS) @Optional() private _loginOptions: KeycloakLoginOptions = {}
  ) {}

  login(options?: KeycloakLoginOptions): Promise<void> {
    const loginOptions = Object.assign({}, this._loginOptions, options);
    return this._toNativePromise(this.keycloak.login(loginOptions));
  }

  logout(options?: any): Promise<void> {
    return this._toNativePromise(this.keycloak.logout(options));
  }

  authenticated(): boolean {
    return this.keycloak.authenticated;
  }

  /**
   * If the token expires within `minValidity` seconds, the token is refreshed.
   * If the session status iframe is enabled, the session status is also
   * checked.
   */
  refreshToken(minValidity: number = 5): Promise<boolean> {
    return this._toNativePromise(this.keycloak.updateToken(minValidity));
  }

  getToken(): string {
    return this.keycloak.token;
  }

  getAuthHeader(): HttpHeaders {
    const authToken = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
  }

  getUserInfo(): Observable<KeycloakProfile | undefined> {
    if (!this.authenticated() || this.keycloak.profile) {
      return of(this.keycloak.profile);
    }

    return from(
      new Promise((resolve, reject) => {
        this.keycloak
          .loadUserProfile()
          .success(resolve)
          .error(err => reject(err));
      })
    );
  }

  private _toNativePromise<TSuccess, TError>(
    promise: Keycloak.KeycloakPromise<TSuccess, TError>
  ): Promise<TSuccess> {
    return new Promise((resolve, reject) => promise.success(resolve).error(reject));
  }
}

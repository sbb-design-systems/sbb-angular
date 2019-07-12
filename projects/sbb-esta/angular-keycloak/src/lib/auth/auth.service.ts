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

  /**
   * Redirects to login form.
   * @param options Login options.
   */
  login(options?: KeycloakLoginOptions): Promise<void> {
    const loginOptions = Object.assign({}, this._loginOptions, options);
    return this._toNativePromise(this.keycloak.login(loginOptions));
  }

  /**
   * Redirects to logout.
   * @param options Logout options.
   * @param options.redirectUri Specifies the uri to redirect to after logout.
   */
  logout(options?: any): Promise<void> {
    return this._toNativePromise(this.keycloak.logout(options));
  }

  /**
   * Is true if the user is authenticated, false otherwise.
   */
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

  /**
   * Returns the current token.
   */
  getToken(): string {
    return this.keycloak.token;
  }

  /**
   * Returns an instance of HttpHeaders with the Authorization entry
   * or an empty instance of HttpHeaders, if the token is not available.
   */
  getAuthHeader(): HttpHeaders {
    const authToken = this.getToken();
    return authToken
      ? new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
      : new HttpHeaders();
  }

  /**
   * Returns or loads the user profile information.
   * If no user is authenticated, returns an observable of undefined.
   */
  getUserInfo(): Observable<KeycloakProfile | undefined> {
    if (!this.authenticated()) {
      return of(undefined);
    } else if (this.keycloak.profile) {
      return of(this.keycloak.profile);
    } else {
      return from(this._toNativePromise(this.keycloak.loadUserProfile()));
    }
  }

  private _toNativePromise<TSuccess, TError>(
    promise: Keycloak.KeycloakPromise<TSuccess, TError>
  ): Promise<TSuccess> {
    return new Promise((resolve, reject) => promise.success(resolve).error(reject));
  }
}

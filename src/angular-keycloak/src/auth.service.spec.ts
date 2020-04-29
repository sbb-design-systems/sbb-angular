/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Test für den Authenticationservice
 *
 * @author u218609 (Kevin Kreuzer)
 * @author ue88070 (Lukas Spirig)
 * @version: 3.0.0
 * @since 24.05.2018, 2017.
 */
import { HttpHeaders } from '@angular/common/http';
import { KeycloakProfile } from 'keycloak-js';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  class KeycloakPromise {
    private _resolve?: Function;
    private _reject?: Function;

    static resolveAfterwards(value?: any) {
      return new KeycloakPromise().resolveAfterwards(value);
    }

    static rejectAfterwards(value?: any) {
      return new KeycloakPromise().rejectAfterwards(value);
    }

    success(resolve: Function) {
      this._resolve = resolve;
      return this;
    }

    error(reject: Function) {
      this._reject = reject;
      return this;
    }

    resolveAfterwards(value?: any) {
      setTimeout(() => this._resolve!(value), 10);
      return this;
    }

    rejectAfterwards(value?: any) {
      setTimeout(() => this._reject!(value), 10);
      return this;
    }
  }

  it('should call .login on the AuthService.keycloak on login', async () => {
    // given
    const sut = new AuthService();
    let loginCalled = false;
    sut.keycloak = {
      login: () => {
        loginCalled = true;
        return KeycloakPromise.resolveAfterwards();
      }
    } as any;
    // when
    await sut.login();
    // then
    expect(loginCalled).toBeTruthy();
  });

  it('should call .logout on the AuthService.keycloak on logout', async () => {
    // given
    const sut = new AuthService();
    let logoutCalled = false;
    sut.keycloak = {
      logout: () => {
        logoutCalled = true;
        return KeycloakPromise.resolveAfterwards();
      }
    } as any;
    // when
    await sut.logout();
    // then
    expect(logoutCalled).toBeTruthy();
  });

  it(`should return the value of .authenticated on the EstaAuthService.keycloak when we call authenticated`, () => {
    // given
    const sut = new AuthService();
    sut.keycloak = {
      authenticated: true
    } as any;
    // when
    const isAuthenticated = sut.authenticated();
    // then
    expect(isAuthenticated).toBeTruthy();
  });

  it(`should return the value .token on the EstaAuthService.keycloak when we call getToken`, () => {
    // given
    const sut = new AuthService();
    const expectedToken = '123-456-789';
    sut.keycloak = { token: expectedToken } as any;
    // when
    const token = sut.getToken();
    // then
    expect(token).toBe(expectedToken);
  });

  it(`should return a promise when we call refreshToken. This promise must be resolved when the refresh was successfull`, async done => {
    // given
    const sut = new AuthService();
    const minValidity = 5;
    const keyCloakMock = {
      updateToken: () => KeycloakPromise.resolveAfterwards(true)
    };
    sut.keycloak = keyCloakMock as any;
    // when
    const refreshed = await sut.refreshToken(minValidity);
    // then
    expect(refreshed).toBeTruthy();
    done();
  });

  it(`should return a promise when we call refreshToken. This promise must be rejected when an error during refresh occured`, async () => {
    // given
    const sut = new AuthService();
    const minValidity = 5;
    const errorMessage = 'The refresh of the token failed';
    const keyCloakMock = {
      updateToken: () => KeycloakPromise.rejectAfterwards(errorMessage)
    };
    sut.keycloak = keyCloakMock as any;
    try {
      await sut.refreshToken(minValidity);
      fail();
    } catch (err) {
      expect(err).toBe(errorMessage);
    }
  });

  it(`should return an Observable that emits undefined on unauthenticated`, async () => {
    const sut = new AuthService();
    const profile: KeycloakProfile = {
      firstName: 'Ruffy',
      lastName: 'Monkey D'
    };
    sut.keycloak = { profile } as any;
    spyOn(sut, 'authenticated').and.returnValue(false);
    const p = await sut.getUserInfo().toPromise();
    expect(p).toBeUndefined();
  });

  it(`should return an Observable that streams the userprofile`, async () => {
    const sut = new AuthService();
    const profile: KeycloakProfile = {
      firstName: 'Ruffy',
      lastName: 'Monkey D'
    };
    sut.keycloak = { profile } as any;
    spyOn(sut, 'authenticated').and.returnValue(true);
    const p = await sut.getUserInfo().toPromise();
    expect(p).toEqual(profile);
  });

  it(`should load the userprofile if the user is authenticated and Keycloak has no profile yet. It should then stream the loaded profile`, async () => {
    const sut = new AuthService();
    const userprofile = {
      firstname: 'Ruffy',
      name: 'Monkey D'
    } as Keycloak.KeycloakProfile;
    sut.keycloak = {
      profile: undefined,
      loadUserProfile: () => KeycloakPromise.resolveAfterwards(userprofile)
    } as any;
    spyOn(sut, 'authenticated').and.returnValue(true);
    const profile = await sut.getUserInfo().toPromise();
    expect(profile).toEqual(userprofile);
  });

  it(`should load the userprofile if the user is authenticated and Keycloak has no profile yet. It should then stream an error if an error occured during the loading of the profile`, async () => {
    // given
    const sut = new AuthService();
    const errorMessage = 'An error occured while loading the profile';
    sut.keycloak = {
      profile: false,
      loadUserProfile: () => KeycloakPromise.rejectAfterwards(errorMessage)
    } as any;
    spyOn(sut, 'authenticated').and.returnValue(true);
    // when - then
    try {
      await sut.getUserInfo().toPromise();
      fail();
    } catch (err) {
      expect(err).toEqual(errorMessage);
    }
  });

  it('must return the AuthHeader with the token', () => {
    // given
    const sut = new AuthService();
    const authToken = 'fdsad-asdfgh-adfasg-adsfg';
    const expectedAuthHeader = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    spyOn(sut, 'getToken').and.returnValue(authToken);
    // when
    const authHeader = sut.getAuthHeader();
    // then
    expect(authHeader).toEqual(expectedAuthHeader);
  });
});

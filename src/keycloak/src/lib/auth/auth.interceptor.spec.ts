import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let sut: AuthInterceptor;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('authService', [
      'getAuthHeader',
      'login',
      'authenticated'
    ]);
    sut = new AuthInterceptor(authService);
  });

  it('should throw an error in case of a failed request', async () => {
    const request = jasmine.createSpyObj<HttpRequest<any>>('request', ['clone']);
    const next = jasmine.createSpyObj<HttpHandler>('next', ['handle']);
    const authHeader: any = { Authorization: 'Bearer some token' };
    const errorMessage = 'Something went wrong';

    next.handle.and.returnValue(throwError(errorMessage));
    authService.getAuthHeader.and.returnValue(authHeader);
    authService.authenticated.and.returnValue(true);

    try {
      await sut.intercept(request, next).toPromise();
      fail();
    } catch (e) {
      expect(e).toEqual(errorMessage);
    }
  });

  it('should call login on the authService for unauthorized requests', async () => {
    const request = jasmine.createSpyObj<HttpRequest<any>>('request', ['clone']);
    const next = jasmine.createSpyObj<HttpHandler>('next', ['handle']);
    const error = {
      error: 'Something went wrong',
      status: 401
    };
    const httpError = new HttpErrorResponse(error);

    next.handle.and.returnValue(throwError(httpError));
    authService.authenticated.and.returnValue(false);
    authService.login.and.returnValue(Promise.resolve());

    await sut.intercept(request, next).toPromise();
    expect(authService.login).toHaveBeenCalled();
  });

  it('should call login on the authService for forbidden requests', async () => {
    const request = jasmine.createSpyObj<HttpRequest<any>>('request', ['clone']);
    const next = jasmine.createSpyObj<HttpHandler>('next', ['handle']);
    const error = {
      error: 'Something went wrong',
      status: 403
    };
    const httpError = new HttpErrorResponse(error);

    next.handle.and.returnValue(throwError(httpError));
    authService.authenticated.and.returnValue(false);
    authService.login.and.returnValue(Promise.resolve());

    await sut.intercept(request, next).toPromise();
    expect(authService.login).toHaveBeenCalled();
  });
});

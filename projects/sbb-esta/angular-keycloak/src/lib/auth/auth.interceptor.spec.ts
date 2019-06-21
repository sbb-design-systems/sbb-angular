import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { CompletionObserver, throwError } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let sut: AuthInterceptor;
  let authService;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('authService', [
      'getAuthHeader',
      'login',
      'authenticated'
    ]);
    sut = new AuthInterceptor(authService);
  });

  describe('intercept', () => {
    it('must throw an error in case of a failed request', done => {
      // given
      const request = jasmine.createSpyObj<HttpRequest<any>>('request', ['clone']);
      const next = jasmine.createSpyObj<HttpHandler>('next', ['handle']);
      const authHeader = { Authorization: 'Bearer some token' };
      const errorMessage = 'Something went wrong';

      next.handle.and.returnValue(throwError(errorMessage));
      authService.getAuthHeader.and.returnValue(authHeader);
      authService.authenticated.and.returnValue(true);

      // when
      const intercept$ = sut.intercept(request, next);

      // then
      const observer = {
        error: error => {
          expect(error).toEqual(errorMessage);
          done();
        }
      };
      intercept$.subscribe(observer);
    });

    it('must call login on the authService for unauthorized requests', done => {
      // given
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

      // when
      const intercept$ = sut.intercept(request, next);

      // then
      const observer: CompletionObserver<any> = {
        complete: () => {
          expect(authService.login).toHaveBeenCalled();
          done();
        }
      };
      intercept$.subscribe(observer);
    });

    it('must call login on the authService for forbidden requests', done => {
      // given
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

      // when
      const intercept$ = sut.intercept(request, next);

      // then
      const observer: CompletionObserver<any> = {
        complete: () => {
          expect(authService.login).toHaveBeenCalled();
          done();
        }
      };
      intercept$.subscribe(observer);
    });
  });
});

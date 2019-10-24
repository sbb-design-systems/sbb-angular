This module contains various constants for the SBB SSO service.

### OAuth/OpenID Connect Library

We recommend [angular-oauth2-oidc](https://www.npmjs.com/package/angular-oauth2-oidc)
to be used for authentication. See the
[documentation](https://manfredsteyer.github.io/angular-oauth2-oidc/docs/index.html)
for details.

**Note**: We will continue to support `@sbb-esta/angular-keycloak` in the foreseeable
future. However, we recommend using `angular-oauth2-oidc`.

#### resourceAccess

This module provides the function `resourceAccess`, which can be used to read
the client roles from an SBB SSO access token.

```ts
import { resourceAccess } from '@sbb-esta/angular-core/oauth';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private roles: null | { [resource: string]: { roles: string[] } };

  constructor(oauthService: OAuthService) {
    this.roles = resourceAccess(oauthService); // Or resourceAccess(oauthService.getAccessToken())
  }
}
```

#### Example configuration

This is a minimal example

**app.module.ts**

```ts
...
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    ...
    HttpClientModule,
    OAuthModule.forRoot({
      // Provide a list of hosts, to which the access token should
      // automatically be sent to via interceptor.
      allowedUrls: ['https://my-backend.example'],
      sendAccessToken: true
    }),
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**app.component.ts**

```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { first } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  get claims() {
    return this.oauthService.getIdentityClaims();
  }

  get scopes() {
    return this.oauthService.getGrantedScopes();
  }

  constructor(private oauthService: OAuthService, private router: Router) {
    this.oauthService.configure(environment.authConfig);
    // If login is required, use loadDiscoveryDocumentAndLogin(this.router.url) instead.
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    // Automatically redirect to the page the user was on before the login.
    // This reads the state set in login().
    this.oauthService.events.pipe(first(e => e.type === 'token_received')).subscribe(() => {
      if (this.oauthService.state) {
        this.router.navigate([this.oauthService.state]);
      }
    });
  }

  login() {
    // Configure the current url as state.
    this.oauthService.initLoginFlow(this.router.url);
  }

  logout() {
    this.oauthService.logOut();
  }
}
```

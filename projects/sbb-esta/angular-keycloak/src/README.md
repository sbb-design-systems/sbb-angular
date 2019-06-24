# Esta Web JS Exstentions

  * [Getting started](#getting-started)
  * [Authentication module](#authentication-module)
    + [How to use the authentication module](#how-to-use-the-authentication-module)
    + [Authentication service](#authentication-service)

This project contains all extensions for esta-webjs-2.
Currently we offer the following extensions:
- Authentication module

## Getting started
To use esta-webjs-extensions you need to have node and npm installed.
You can then install esta-webjs-extensions with the following command:

```
npm install --save esta-webjs-extensions
```

## Authentication Module
The authentication module provides functionality for SSO
with Keycloak. It provides an authentication service that you
can use to handle all your authentication tasks.

It also provides an optional interceptor ([Angular Interceptor](https://angular.io/guide/http#intercepting-all-requests-or-responses)).
It is not contained in the authentication module but can be used
by adding AUTH_INTERCEPTOR to the AppModule.

### How to use the authentication module
After the redirect from the authentication server, keycloak needs to be
notified even before Angular has started. This is achieved by using 
Angular App Initializers.

You can import the AuthModule in your app module or in your core module.
Use the forRoot method to provide the configuration.

The keycloak configuration has to match the following interface:

```
interface KeycloakConfig {
  url?: string;
  realm?: string;
  clientId?: string;
}
```

```
 ...
import { AuthModule, AUTH_INTERCEPTOR } from 'esta-webjs-extensions';

import { environment } from '../environment/environment'; // Your Angular CLI Environment config

@NgModule({
  imports: [
    AuthModule.forRoot(environment.authConfig)
  ],
  declarations: [...],
  providers: [
    AUTH_INTERCEPTOR // Optional
  ]
})
export class CoreModule {
}
```

By importing the AuthModule the AuthService is now available over dependency injection inside your application.
```
import { AuthService } from 'esta-webjs-extensions';

@Component({
    selector: ...,
    templateUrl: ...
})
export class SampleComponent{

    constructor(private authService: AuthService) {
    }
}
```

### Authentication Module
The Authentication Module provides the authentication service.
It exposes the static forRoot method to configure authentication.

```
AuthModule.forRoot(
  config: string | KeycloakConfig,
  options?: KeycloakInitOptions,
  loginOptions?: KeycloakLoginOptions)
```

| Parameter | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| config    | **Required** Either a configuration object or an url where the configuration is provided in json format |
| options   | **Optional** Options object (default is { onLoad: 'check-sso', flow: 'implicit' }) |
| loginOptions | **Optional** Login options object, which will be used on AuthService.login (default is { idpHint: 'adfs_sbb_prod' }) |


### Authentication Service
The Authentication Service provides the necessary API to interact with
the authentication module.

| Method                                   	| Description                                                                                                                                                                                                                                                                                                                                                                                                 	|
|------------------------------------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| login: Promise<void>                     	| When you call this method you are redirected to the authentication server where you need to enter your credentials. After a successful login you are then redirect to your app. The AuthModule then internally stores the authorization token. This token is stored persistent. It is also available after a window refresh. You can get the token by calling the getToken() method of the auth service.   	|
| getToken: string                         	| This method returns the stored token. Notice that it only returns the token and not the complete authHeader. To get the authHeader you can use the getAuthHeader() method on the authService.                                                                                                                                                                                                               	|
| getAuthHeader: any                       	| This method returns an auth header object. This auth header object has an authorization property that contains Bearer + token as value.                                                                                                                                                                                                                                                                     	|
| refreshToken: Promise<boolean>           	| This method allows you to refresh the token. It returns a promise that indicates if the refresh has been successful or not. Don't forget to call getToken() again to get the refreshed token.                                                                                                                                                                                                              	|
| getUserInfo: Observable<KeycloakProfile> 	| This method returns you an Observable who streams the user profile. This user profile has the following structure. - id?: string - username?: string - email?: string - firstName?: string - lastName?: string - enabled?: boolean - emailVerified?: boolean - totp?: boolean - createdTimestamp?: number                                                                                                   	|
| authenticated: boolean                   	| Returns a boolean that indicates if the user is authenticated or not.                                                                                                                                                                                                                                                                                                                                     	|
| logout: Promise<void>                    	| logout: voidThis method will logout the current user and remove the token from the auth module.                                                                                                                                                                                                                                                                                                             	|

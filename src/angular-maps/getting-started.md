# Getting Started

The package `@sbb-esta/angular-maps` provides a fast and easy way to integrate maps and geograhical 3D scenes into your Angular application. Continue reading in [Overview and usage](/maps/introduction/overview-and-usage) to learn more about the core concepts behind the package. [Mapping basics](/maps/introduction/mapping-basics) gives you a short introduction on what a map is and how to make good maps. Finally, the _Advanced Usage_ section (see sidebar menu) links to a few custom tailored samples on how to actually use the mapping components in your application workflows.

### Library integration

Basic steps to integrate the `@sbb-esta/angular-maps` library into your own project.

### Step 0: Prerequisites

You need to install [Node.js](https://nodejs.org/it/) first, and assure yourself to have a working javascript dependency manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/).

Also we recommend to install globally the latest Angular CLI using the following command:

```sh
npm install -g @angular/cli
```

or using yarn:

```sh
yarn global add @angular/cli
```

You can create now your project as described in the official [Angular CLI documentation](https://cli.angular.io/).

### Step 1: Install the library

Just after you created your own Angular project, in order to include the library, you have to install the `@sbb-esta/angular-maps` and [@arcgis/core](https://www.npmjs.com/package/@arcgis/core) dependencies:

```sh
npm install @arcgis/core@4.20.2 @sbb-esta/angular-maps
```

or, if using yarn:

```sh
yarn add @arcgis/core@4.20.2 @sbb-esta/angular-maps
```

### Step 2: Configure the library

Once the `@sbb-esta/angular-maps` package is installed, you are able to configure your application, in order to use a specific portal (by default the ArcGIS online portal is used), a different version of [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/latest/guide/get-api/) or some other settings:

```ts
import { SbbEsriConfigModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [SbbEsriConfigModule.forRoot({ portalUrl: 'https://www.arcgis.com' })],
  ...
})
export class TrainChooChooAppModule {}
```

The ArcGIS API for Javascript allows for cross origin requests made to associated servers to include credentials such as cookies and authorization headers. This is indicated by a list of named so called _trustedServers_ (see [documentation](https://developers.arcgis.com/javascript/latest/api-reference/esri-config.html#request)).

[Read more on how the ArcGIS API for Javascript handles CORS](https://developers.arcgis.com/javascript/latest/guide/cors/index.html).

Allowing a quick start in the SBB environment, the following hosts are preconfigured as _trustedServers_ in `@sbb-esta/angular-maps` by default: _geo-dev.sbb.ch_, _geo-int.sbb.ch_ and _geo.sbb.ch_. Additionally _wms.geo.admin.ch_ is preconfigured in _trustedServers_, too. In order to use the standard configurations, call `forRoot()` without parameters:

```ts
import { SbbEsriConfigModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [SbbEsriConfigModule.forRoot()],
  ...
})
export class TrainChooChooAppModule {}
```

If you do not call `SbbEsriConfigModule.forRoot` at all, the default Esri ArcGIS API configuration will be used, without SBB environment specific `trustedServers`.

### Step 3: Import the component modules

Import the NgModule for each component you want to use:

```ts
import { EsriWebMapModule, EsriWebSceneModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [EsriWebMapModule, EsriWebSceneModule],
  ...
})
export class TrainChooChooAppModule {}
```

### Step 4: Configure CSS

Choose an angular-map [theme](https://developers.arcgis.com/javascript/latest/styling/#themes) and then configure your App to use the Esri ArcGIS CDN, for example:

_styles.(s)css_

```
@import url("https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/light/main.css");
```

Or, if you are working with local assets, see the [Managing assets locally](https://developers.arcgis.com/javascript/latest/es-modules/#managing-assets-locally) section.

# Getting Started

The packages `@sbb-esta/angular-maps` and `@sbb-esta/angular-maps-leaflet` provide fast and easy ways to integrate maps and geograhical 3D scenes into your Angular application. `@sbb-esta/angular-maps` is based on the ArcGIS API for Javascript and allows to leverage the full power of the ArcGIS platform and the SBB GIS stack. `@sbb-esta/angular-maps-leaflet` provides a small and fast mapping component based on Leaflet and enriched with [`esri-leaflet`](https://esri.github.io/esri-leaflet/) to easily integrate with ArcGIS based services.Continue reading in [Overview and usage](/maps/introduction/overview-and-usage) to learn more about the core concepts behind the packages and when to use which component and package (see section _Usage Patterns_). [Mapping basics](/maps/introduction/mapping-basics) gives you a short introduction on what a map is and how to make good maps. Finally, the _Advanced Usage_ section (see sidebar menu) links to a few custom tailored samples on how to actually use the `@sbb-esta/angular-maps` mapping components in your application workflows.

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

Just after you created your own Angular project, in order to include the library, you have to install the `@sbb-esta/angular-maps`, `@types/arcgis-js-api` and `esri-loader` dependencies:

```sh
npm install --save @types/arcgis-js-api esri-loader @sbb-esta/angular-maps
```

or, if using yarn:

```sh
yarn add @types/arcgis-js-api esri-loader @sbb-esta/angular-maps
```

### Step 2: Configure the library

Once the `@sbb-esta/angular-maps` package is installed, you are able to configure your application, in order to use a specific portal (by default the ArcGIS online portal is used), a different [ArcGIS Javascript API Version](https://developers.arcgis.com/javascript/latest/guide/get-api/) or some other settings.

```ts
import { EsriConfigModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [EsriConfigModule.forRoot({ portalUrl: 'https://www.arcgis.com' })],
  ...
})
export class TrainChooChooAppModule { }
```

If you do not have specific conifgurations, you can use the standard configurations as well using:

```ts
import { EsriConfigModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [EsriConfigModule],
  ...
})
export class TrainChooChooAppModule { }
```

### Step 3: Import the component modules

Import the NgModule for each component you want to use:

```ts
import { EsriWebMapModule, EsriWebSceneModule } from '@sbb-esta/angular-maps';

@NgModule({
  ...
  imports: [EsriWebMapModule, EsriWebSceneModule],
  ...
})
export class TrainChooChooAppModule { }
```

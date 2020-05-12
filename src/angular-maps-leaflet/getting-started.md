# Getting Started

The package `@sbb-esta/angular-maps-leaflet` provides a fast and easy way to integrate maps into your Angular application. Continue reading in [Overview and usage](/maps/introduction/overview-and-usage) to learn more about the core concepts behind the package. [Mapping basics](/maps/introduction/mapping-basics) gives you a short introduction on what a map is and how to make good maps. Finally, the _Advanced Usage_ section (see sidebar menu) links to a few custom tailored samples on how to actually use the mapping components in your application workflows.

### Library integration

Basic steps to integrate the `@sbb-esta/angular-maps-leaflet` library into your own project.

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

Just after you created your own Angular project, in order to include the library, you have to install the `@sbb-esta/angular-maps-leaflet`, `@types/esri-leaflet` and `esri-leaflet` dependencies:

```sh
npm install --save @types/esri-leaflet leaflet @sbb-esta/angular-maps-leaflet
```

or, if using yarn:

```sh
yarn add @types/arcgis-js-api esri-loader @sbb-esta/angular-maps
```

### Step 2: Import the component modules

Import the NgModule for the components you want to use:

```ts
import { LeafletMapModule } from '@sbb-esta/angular-maps-leaflet';

@NgModule({
  ...
  imports: [LeafletMapModule]
  ...
})
export class TrainChooChooAppModule { }
```

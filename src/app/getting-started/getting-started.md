
# Getting Started

Basic steps to integrate the ACL library into your own project.

## Step 0: Prerequisites

You need to install [Node.js](https://nodejs.org/it/)  first, and assure yourself to have a working javascript dependency manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/).

Also we recommend to install globally the latest Angular CLI using the following command:

```sh
npm install -g @angular/cli
```

or using yarn:

```sh
yarn global add @angular/cli
```

You can create now your project as described in the official [Angular CLI documentation](https://cli.angular.io/).

## Step 1: Prerequisites

Just after you created your own Angular project, in order to include the ACL library, you have to install the ```sbb-angular``` dependency:

```sh
npm install --save sbb-angular
```

or, if using yarn:

```sh
yarn add sbb-angular
```

## Step 2: Configure animations

Once the "sbb-angular" package is installed, you have to configure your application to enable animations support:

```ts
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [BrowserAnimationsModule],
  ...
})
export class TrainChooChooAppModule { }
```

if you prefer not to have the animations, you have to configure your application with the ```NoopAnimationsModule```:

```ts
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [NoopAnimationsModule],
  ...
})
export class TrainChooChooAppModule { }
```
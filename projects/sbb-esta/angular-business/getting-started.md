# Getting Started

Basic steps to integrate the sbb-angular library into your own project.

## Step 0: Prerequisites

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

## Step 1: Install the library

Just after you created your own Angular project, in order to include the library, you have to install the `@sbb-esta/angular-business`, `@sbb-esta/angular-core`, `@sbb-esta/angular-icons` and `@angular/cdk` dependencies:

```sh
npm install --save @sbb-esta/angular-business @sbb-esta/angular-core @sbb-esta/angular-icons @angular/cdk
```

or, if using yarn:

```sh
yarn add @sbb-esta/angular-business @sbb-esta/angular-core @sbb-esta/angular-icons @angular/cdk
```

## Step 2: Configure animations

Once the "@sbb-esta/angular-business" package is installed, you have to configure your application to enable animations support:

```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [BrowserAnimationsModule],
  ...
})
export class TrainChooChooAppModule { }
```

if you prefer not to have the animations, you have to configure your application with the `NoopAnimationsModule`:

```ts
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [NoopAnimationsModule],
  ...
})
export class TrainChooChooAppModule { }
```

## Step 3: Include typography CSS

Including typography is required to apply all SBB styles to your application. That is doable by editing the `styles.(s)css`:

```css
@import '../node_modules/@sbb-esta/angular-business/typography.css';
```

or editing your `angular.json`:

```json
  ...
  "styles": [
    "src/styles.scss",
    "node_modules/@sbb-esta/angular-business/typography.css"
  ],
  ...
```

If you need more details about what the typography offers to you, you can get to [typography](./typography).

## Step 4: Import the component modules

Import the NgModule for each component you want to use:

```ts
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';

@NgModule({
  ...
  imports: [ButtonModule, CheckboxModule],
  ...
})
export class TrainChooChooAppModule { }
```

Alternatively, you can create a separate NgModule that imports all of the components that you will use in your application. You can then include this module wherever you'd like to use the components.

```ts
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';

@NgModule({
  imports: [ButtonModule, CheckboxModule],
  exports: [ButtonModule, CheckboxModule]
})
export class SbbModule {}
```

Whichever approach you use, be sure to import the modules after Angular's BrowserModule, as the import order matters for NgModules.

## Step 5: i18n

This library uses [Angular i18n](https://angular.io/guide/i18n). All translatables have an id with the pattern "sbb*Component*".
Run `ng xi18n` in your project (after using components of this library in your code) to generate the list of translatables.

### Datepicker i18n:

The datepicker uses the CLDR data [provided by Angular](https://angular.io/guide/i18n#setting-up-the-locale-of-your-app).
This means it uses the locale data configured via the `i18nLocale` entry in your angular.json `build` options or configurations.

## Step 6 (Optional): Use mixins and functions from the library

If you need to reuse some mixins from the library, you have to configure your own Angular application in
SCSS mode and import `_styles.scss` from the library into your `styles.scss`:

```scss
@import '../node_modules/@sbb-esta/angular-business/styles';
```

If you need more fine-grained usage of the SCSS sources, you can import from `@sbb-esta/angular-core/styles/common/*`:

```scss
@import '../node_modules/@sbb-esta/angular-core/styles/common/colors';
@import '../node_modules/@sbb-esta/angular-core/styles/common/variables';
@import '../node_modules/@sbb-esta/angular-core/styles/common/functions';
@import '../node_modules/@sbb-esta/angular-core/styles/common/mixins';
@import '../node_modules/@sbb-esta/angular-core/styles/common/mediaqueries';
```

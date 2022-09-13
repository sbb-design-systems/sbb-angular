# Getting Started

Basic steps to integrate the sbb-angular library into your own project.

## Step 0: Prerequisites

You need to install [Node.js](https://nodejs.org/it/) first, and assure yourself to have a working javascript dependency manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/).

Also, we recommend installing the latest Angular CLI globally using the following command:

```sh
npm install -g @angular/cli
```

or using yarn:

```sh
yarn global add @angular/cli
```

You can create now your project as described in the official [Angular CLI documentation](https://cli.angular.io/).

## Step 1: Install the library

### Automatic installation

Just after you created your own Angular project, in order to include the library, you have to run ng add which will take care of the installation and configuration.

```sh
ng add @sbb-esta/angular
```

### Manual installation

ⓘ Please skip manual installation if you use ng add (see automatic installation).

#### Step 1.1

You have to install the `@sbb-esta/angular` and `@angular/cdk` dependencies:

```sh
npm install --save @sbb-esta/angular @angular/cdk
```

or, if using yarn:

```sh
yarn add @sbb-esta/angular @angular/cdk
```

#### Step 1.2: Include typography CSS

Including typography is required to apply all SBB styles to your application. That is doable by editing the `styles.(s)css`:

```css
@import '@sbb-esta/angular/typography.css';
```

or editing your `angular.json`:

```json
  ...
  "styles": [
    "src/styles.scss",
    "node_modules/@sbb-esta/angular/typography.css"
  ],
  ...
```

The `typography.css` file only contains a subset of the `SBBWeb` fonts that does not contain all characters (e.g. the French "œ").
For including the full fontset, we provide the `fullfont.css` file which can be added after the `typography.css` file.

```css
@import '@sbb-esta/angular/typography.css';
@import '@sbb-esta/angular/fullfont.css';
```

If you need more details about what the typography offers to you, you can go to [typography](/angular/introduction/typography).

#### Step 1.3: Configure animations

Once the `@sbb-esta/angular` package is installed, you have to configure your application to enable animations support:

```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [BrowserAnimationsModule],
  ...
})
export class TrainChooChooAppModule {}
```

if you prefer not to have the animations, you have to configure your application with the `NoopAnimationsModule`:

```ts
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [NoopAnimationsModule],
  ...
})
export class TrainChooChooAppModule {}
```

#### Step 1.4: Configure design variant

For standard variant, nothing has to be configured.

To set up the lean design variant, please add the css class `sbb-lean` to your html tag in `index.html`.

```html
<html class="sbb-lean">
  ...
</html>
```

In order to also use the correct setup in unit tests, add the following lines to your `test.ts` file:

```ts
// Configures your test environment to use lean design variant by setting sbb-lean class on html tag.
document.documentElement.classList.add('sbb-lean');
```

## Step 2: Import the component modules

Import the NgModule for each component you want to use:

```ts
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

@NgModule({
  ...
  imports: [SbbButtonModule, SbbCheckboxModule],
  ...
})
export class TrainChooChooAppModule {}
```

Alternatively, you can create a separate NgModule that imports all of the components that you will use in your application. You can then include this module wherever you'd like to use the components.

```ts
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

@NgModule({
  imports: [SbbButtonModule, SbbCheckboxModule],
  exports: [SbbButtonModule, SbbCheckboxModule],
})
export class SbbModule {}
```

Whichever approach you use, be sure to import the modules after Angular's BrowserModule, as the import order matters for NgModules.

## Step 3 (Optional): Use mixins and functions from the library

If you need to reuse some mixins from the library, you have to configure your own Angular application in
SCSS mode and import via `@use`:

```scss
@use '@sbb-esta/angular' as sbb;
```

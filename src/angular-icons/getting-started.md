# Getting Started

The `@sbb-esta/angular-icons` package contains the icons provided by
[digital.sbb.ch](https://digital.sbb.ch/en/icons-und-piktogramme/sbb-icons)
converted to Angular components.

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

Just after you created your own Angular project, in order to include the library, you have to install the `@sbb-esta/angular-icons` dependency:

```sh
npm install --save @sbb-esta/angular-icons
```

or, if using yarn:

```sh
yarn add @sbb-esta/angular-icons
```

## Step 2: Use the icons

Each icon is available as its own module. For example the arrow right icon is available as `IconArrowRightModule`.
Once imported in your module, the icon can be used with its tag:

```ts
@NgModule({
  ...
  imports: [IconArrowRightModule],
  ...
})
export class MyModule { }
```

```html
<sbb-icon-arrow-right></sbb-icon-arrow-right>
```

If you just want to import all icons, there is a collection module available: `IconCollectionModule`.
This module contains all available icons.

Note: The intention with the module per icon is, that it can be tree shaked. If you use the collection
modules, they cannot be tree shaken.

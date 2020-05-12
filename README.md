# SBB Components and Design for Angular

This is the repository for the Angular component library for SBB.
It is generated, maintained, tested, linted and built with the [Angular CLI](https://cli.angular.io/).

[Documentation/Showcase](https://angular.app.sbb.ch/latest/)

[Design Specification](https://digital.sbb.ch/)

## Packages

`npm install --save @sbb-esta/angular-core @sbb-esta/angular-icons @sbb-esta/angular-public`

### [@sbb-esta/angular-core](https://www.npmjs.com/package/@sbb-esta/angular-core)

The package containing core functionality shared by `@sbb-esta/angular-public` and `@sbb-esta/angular-business`.

### [@sbb-esta/angular-icons](https://www.npmjs.com/package/@sbb-esta/angular-icons)

The package containing SBB icons as components.

[Icon List](https://angular.app.sbb.ch/latest/icons/search)

[SVG Origin](https://digital.sbb.ch/de/icons-und-piktogramme/sbb-icons)

### [@sbb-esta/angular-public](https://www.npmjs.com/package/@sbb-esta/angular-public)

The package containing the components/modules for public SBB websites.

[Component List](https://angular.app.sbb.ch/latest/public)

### [@sbb-esta/angular-business](https://www.npmjs.com/package/@sbb-esta/angular-business)

The package containing the components/modules for SBB business applications.

[Component List](https://angular.app.sbb.ch/latest/business)

### [@sbb-esta/angular-maps](https://www.npmjs.com/package/@sbb-esta/angular-maps)

The package containing components to display 2D/3D maps and to provide map interaction.

[Component List](https://angular.app.sbb.ch/latest/maps)

### [@sbb-esta/angular-maps-leaflet](https://www.npmjs.com/package/@sbb-esta/angular-maps-leaflet)

The package containing components to display a 2D leaflet-map.

[Component List](https://angular.app.sbb.ch/latest/leaflet)

### [@sbb-esta/angular-keycloak](https://www.npmjs.com/package/@sbb-esta/angular-keycloak)

The package containing the authentication module keycloak.

## Browser and screen reader support

This library supports the most recent two versions of all major browsers: Chrome (including Android), Firefox, Safari (including iOS), and IE11 / Edge.

We aim for great user experience with the following screen readers:

Windows: NVDA and JAWS with IE11 / FF / Chrome.
macOS: VoiceOver with Safari / Chrome.
iOS: VoiceOver with Safari
Android: Android Accessibility Suite (formerly TalkBack) with Chrome.
Chrome OS: ChromeVox with Chrome.

## Testing Supported By

<a href="https://www.browserstack.com/"><img width="160" src="https://user-images.githubusercontent.com/594745/69711802-fc138a80-1101-11ea-9b30-3e90c274737a.png" alt="BrowserStack"/></a>

# Introduction

In addition to the Angular library we publish our `JourneyMaps` component also as a custom element based on the Web Components standard.

It's generated from the Angular Library using [Angular Elements](https://angular.io/guide/elements).

**NOTE** \
This custom element is intended for Non-Angular clients. If you are in an Angular environment we strongly recommend you to use the Angular version of the component.

## Import required files

The custom element is published in the same package as the Angular component. It can be installed like this:

```sh
npm install --save @sbb-esta/journey-maps-wc
```

Afterwards, you have to include the following two imports in your application:

- `@sbb-esta/journey-maps-wc`
- `@sbb-esta/journey-maps-wc/styles.css`

**NOTE** \
This library does NOT need any peer dependencies. MapLibre and Angular are included in the bundle.
Because of a technical limitation it uses the same `package.json` as the Angular library. Therefore you might get a warning about missing peer dependencies.

## Create an instance of the custom component

To avoid problems with the angular component we named this component `sbb-journey-maps-wc` (instead of `sbb-journey-maps`).

### With HTML

After importing the required files you can create an instance like this:

```html
<sbb-journey-maps-wc api-key="<API_KEY>" lang="en"></sbb-journey-maps-wc>
```

Angular `@Input` properties are available as (dash-separated, lowercase) attributes of the component. (e.g. `@Input() apiKey` becomes `api-key`). You can find the full list of these properties in our [Angular API](/journey-maps/components/angular/api).

You can get your API key on the [SBB API Platform](https://developer.sbb.ch/apis/journey-maps-tiles).

### With JS

If you want to register for output events or pass object-type input parameters, you can create the component in JavaScript.

Component outputs are dispatched as HTML [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
The emitted data is stored on the event’s detail property.

```js
// Create custom element
var client = document.createElement('sbb-journey-maps-wc');
client.language = 'en';
client.apiKey = '<API_KEY>';

// Pass object-type input parameter
client.markerOptions = {
  markers: [
    {
      id: 'work',
      title: 'Office',
      position: [7.44645, 46.961409],
      category: 'INFO',
    },
  ],
};

// Register for event
client.addEventListener('zoomLevelsChange', (event) =>
  console.log('Current zoom: ', event.detail.currentZoom),
);

// Add to document
document.addEventListener('DOMContentLoaded', () =>
  document.getElementById('container').appendChild(client),
);
```

For a full list of all inputs and outputs, please check our [Angular API](/journey-maps/components/angular/api).

## Define templates for click or hover events

The usage of templates (e.g. what to display in the popup when a marker is clicked) is a little bit different than with Angular.

We use the [HTML template tag](https://developer.mozilla.org/de/docs/Web/HTML/Element/template) (`<template>`) instead of `<ng-template>`.

The first step is to define the template and its id attribute:

```html
<template id="myTemplate">
  <div>Hello World</div>
</template>
```

Then you pass the id of the template to the client:

```js
// Set the marker template directly on the client itself
client.markerDetailsTemplate = 'myTemplate';

// Make markers, stations and pois clickable and set the template for the STATIONs and POIs
client.listenerOptions = {
  MARKER: {
    watch: true,
  },
  STATION: {
    watch: true,
    popup: true,
    clickTemplate: 'myTemplate',
  },
  POI: {
    watch: true,
    popup: true,
    clickTemplate: 'myTemplate',
  },
};
```

Now you can click on a marker, station or poi and your template will be displayed in the defined overlay. (teaser or popup)

Normally, you want the content of your template to differ depending on what has been selected.
This can be achieved if you register to one of our output events (e.g. `featuresClick`) and update your template when an event occurs.

```js
client.addEventListener('featuresClick', (event) => {
  const feature = event.detail?.features?.[0];
  switch (feature?.featureDataType) {
    case 'MARKER':
      document.getElementById('myTemplate').innerHTML =
        `Hello this is ${feature.properties?.title}`;
      break;
    case 'STATION':
      document.getElementById('myTemplate').innerHTML = `
        <div>
          <div>${feature.properties?.name}</div>
          <div>${feature.properties?.uic_ref}</div>
        </div>
      `;
      break;
    case 'POI':
      document.getElementById('myTemplate').innerHTML = `
        <div>
          <div>${feature.properties?.name}</div>
          <div>${feature.properties?.sbbId}</div>
        </div>
      `;
      break;
  }
});
```

**NOTE** \
Don't replace the whole template node. Just update its content.
Because internally we are using an [MutationObserver](https://developer.mozilla.org/de/docs/Web/API/MutationObserver) to watch for changes.

### Run the documentation app using the Web Component on your local machine

If you check out this project from GitHub, You can get a simple example of the Web Component up and running on your local machine by running `JM_API_KEY=<YOUR-API-KEY> yarn start:journey-maps-wc`.

You can interact with the map through the browser console using the same JavaScript syntax as above, e.g.:

```javascript
const client = document.querySelector('sbb-journey-maps-wc');
client.moveEast();
client.selectedMarkerId = 'velo';
```

# API

For the full API, please see our [Angular API](/journey-maps/components/angular/api).

For details on how to use this API via the Web Component, please refer to the [Overview](/journey-maps/components/web-component/overview) or the [Examples](/journey-maps/components/web-component/examples) page.

# Examples

Below are a few example implementations using the Web Component. Please let us know if you have additional use-cases you would like to see covered here.

## On your local machine

If you check out this project from GitHub, You can get a simple example of the Web Component up and running on your local machine by running `JM_API_KEY=<YOUR-API-KEY> yarn start:journey-maps-wc`.

## On Stackblitz

We have provided a React example application showcasing some of the features of the `sbb-journey-maps-wc` web-component.

=> <a href="https://stackblitz.com/edit/sbb-journey-maps-web-component-showcase-ufvxbxw6" target="_blank">Web-Component Stackblitz Example using React</a>

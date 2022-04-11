In addition to the Angular library we publish our `JourneyMaps` component also as a custom element based on the Web Components standard.

It's generated from the Angular Library using [Angular Elements](https://angular.io/guide/elements).

**NOTE** \
This custom element is intended for Non-Angular clients. If you are in an Angular environment we strongly recommend you to use the Angular version of the component.

### Import required files

The custom element is published in the same package as the Angular component. It can be installed like this:

```sh
npm install --save @sbb-esta/journey-maps
```

Afterwards you have to include the following two files in your application:

- `@sbb-esta/journey-maps/web-component/bundle.min.js`
- `@sbb-esta/journey-maps/web-component/styles.css`

### Create an instance of the custom component

To avoid problems with the angular component we named this component `sbb-journey-maps-wc` (instead of `sbb-journey-maps`).

#### With HTML

After importing the required files you can create an instance like this:

```html
<sbb-journey-maps-wc api-key="<API_KEY>" lang="en"></sbb-journey-maps-wc>
```

Angular `@Input` properties are available as (dash-separated, lowercase) attributes of the component. (e.g. `@Input() apiKey` becomes `api-key`)

You can get your API key on the [SBB API Platform](https://developer.sbb.ch/apis/journey-maps-tiles).

#### With JS

If you want to register for output events or pass object-type input parameters you can create the component in JavaScript.

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
  console.log('Current zoom: ', event.detail.currentZoom)
);

// Add to document
document.addEventListener('DOMContentLoaded', () =>
  document.getElementById('container').appendChild(client)
);
```

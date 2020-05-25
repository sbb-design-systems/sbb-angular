# Overview and usage

It has become evident that Angular web applications at SBB need a simple way to display maps. This is one of the most requested features towards the GIS application development team. Having a great component library (`sbb-esta`) at hands, it's been an easy decision to provide simple yet versatile components for mapping needs trough this library.

The components in [`@sbb-esta/angular-maps`](/maps/introduction/getting-started) base on the Esri ArcGIS framework (see section _Technology_ below), matching the technology used for most SBB WebGIS applications and the SBB GIS stack. An additional map component in [`@sbb-esta/angular-maps-leaflet`](/maps-leaflet/introduction/getting-started) bases on the lightweight [LeafletJS](https://leafletjs.com/) component.

The goal of `@sbb-esta/angular-maps` is to provide a fast solution for having a map or a geographical 3D scene up and running with just a few easy steps. Of course, there are alternatives when it comes to the technology used in these components, but we believe this solution works very well in terms of SBB compatilibity and data usage trough the internal G-SHARP services and the SBB Geoportal. Still it allows the integration of almost every other possible data source while keeping the whole programming interface simple yet open to unlock the full power of the underlying technology. On top of that, `@sbb-esta/angular-maps-leaflet` provides a fast and simple mechanisms to display maps without the overhead of the full ArcGIS library.

The package attempts to overcome the mixture of data providers and APIs used at SBB by providing a solution that's simple enough to keep you from defaulting to the Google Maps API (or alike). Using the package you can easily access the SBB internal GIS resources.

`@sbb-esta/angular-maps` currently comes with the requirement to use _web maps_ provided by Portal for ArcGIS or ArcGIS Online (read more about this below). While this gives you a great tool to author your maps, it can also be cumbersome regarding development staging and DevOps processes. This is going to be adressed in further versions of the package.

`@sbb-esta/angular-maps-leaflet` supports [`esri-leaflet`](https://esri.github.io/esri-leaflet/) and this integrated well with the same usage scenarios as `angular-maps` at SBB.

3D _web scenes_ finally are part of a future GIS world and thus an interesting opportunity to invest into - especially considering the simplicity of creating web scenes using Portal for ArcGIS or ArcGIS Online.

### Technology

The current implementation of `@sbb-esta/angular-maps` bases on the [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/) by [Esri](https://www.esri.com). The components provided in `@sbb-esta/angular-maps` are basically wrappers around the core functionality of the _ArcGIS API for Javascript_ with the intention to hide things like the [esri-loader](https://github.com/Esri/esri-loader) and ease the integration in Angular applications (also see our introduction to [Loading ArcGIS API Types](/maps/advanced/loading-arcgis-types)).

Currently, `@sbb-esta/angular-maps` bases on the _ArcGIS API for Javascript_ version _4.14_.

`@sbb-esta/angular-maps-leaflet` bases on _[LeafletJS](https://leafletjs.com/)_ version _1.6_. The component provided in `@sbb-esta/angular-maps-leaflet` is basically a wrapper around the core functionality of _Leaflet_ with the intention to hide complexity and ease the integration in Angular applications, migration from `@sbb-esta/angular-maps` and the consumption of ArcGIS maps and services trough `esri-leaflet` (as described in [Use esri-leaflet](/maps-leaflet/advanced/esri-leaflet)).

### Maps and layers

Maps as used in `@sbb-esta/angular-maps` are technical containers stacking various _layers_ and basemaps (such as aerial imagery). Read more about the core concepts behind the ArcGIS API for Javascript and the ArcGIS mapping framework at <https://developers.arcgis.com/javascript/latest/guide/maps-and-views/> and <https://developers.arcgis.com/javascript/latest/guide/layers-and-data/>.

When using `@sbb-esta/angular-maps-leaftlet` the wording is slightly different: A map is built from (base) layers and overlays. An example of a map configuration can be found in the example section at of the [component documentation](/maps-leaflet/components/leaflet-map). The component basically support everything that can be done with LeafletJS, so heading over to the [Leaflet reference](https://leafletjs.com/reference-1.6.0.html) is a good start.

### What is ArcGIS Online / Portal for ArcGIS

From the [ArcGIS Online FAQ](https://doc.arcgis.com/en/arcgis-online/reference/faq.htm#anchor1):

> ArcGIS Online is a collaborative web GIS that allows you to use, create and share maps, scenes, apps, layers, analytics, and data. You get access to content in ArcGIS Living Atlas of the World, ArcGIS apps, and cloud infrastructure, where you can add items; publish web layers; and create maps, apps, and scenes. ArcGIS Online can be used as an integral part of the ArcGIS system, extending the capabilities of ArcGIS Pro, ArcGIS Enterprise, ArcGIS APIs, and ArcGIS Runtime SDKs.

_Portal for ArcGIS_ is the little "on premises" brother of ArcGIS Online. The [Get Started](https://enterprise.arcgis.com/en/portal/latest/use/what-is-portal-for-arcgis-.htm) of the ArcGIS Enterprise documentation puts it like this:

> The ArcGIS Enterprise portal is a component of ArcGIS Enterprise that allows you to share maps, scenes, apps, and other geographic information with other people in your organization. The front-end portal is powered by the back-end infrastructure of Portal for ArcGIS. The portal administrator can customize the portal to fit your organization's look and feel.

Both platforms allow the creation and publication of maps and scenes and can equally serve as a provider for the `@sbb-esta/angular-maps` components.

The SBB Geoportal (for company use only) is a _Portal for ArcGIS_ installation and provides much of the geo-content that is available internally. It is located at <https://geo.sbb.ch/portal.>

### Usage patterns

It's all about maps. Creating your own map can be challenging. We aim to give you a kick start in the [Mapping basics](/maps/introduction/mapping-basics) section.

#### ArcGIS or Leaflet components

Depending on what you need in your application, it's cruical to select the best matching map component. The [`@sbb-esta/angular-maps`](/maps/introduction/getting-started) package comes with a full implementation of the ArcGIS API for Javascript (as explained above). This comes at a cost: The package is of a large size, the map component loading times are significant for some configuration. If you want to use/do more then displaying a simple map from the ArcGIS portal, the ArcGIS API for Javascript has a steep learning curve, because it involves learning about the full power of the ArcGIS platform, too. Admittedly, there's great documentation, so this should not be a show stopper. Tight integration with the GIS stack at SBB, the ability to support _editing_ of geo data and the whole GeoAnalytics functionality are reasons to use the ArcGIS based map components. And then there's 3D: BIM, 3D Models, Terrains and other fancy looking 3D map displaying are easily done using the `WebScene` component.

For a slim and lightweight alternative, there's [`@sbb-esta/angular-maps-leaflet`](/maps-leaflet/introduction/getting-started). Of course, this comes at the cost of less GIS functionality and not straight support for ArcGIS portal maps. Clear advantages are: Component loading at lightning speed and support for a wide range of standard geo services and data formats. Using `esri-leaflet` it's no magic to use ArcGIS based services as well.

Please refer to the documentation of each framework to read about their strengths and weak points regarding _your_ requirements. There are so many things to consider: Cartography, symbolization, labeling, clustering, map interaction, popup styling, legend integration, table of content interaction and many more - all of these might influence your choice of technology. If you're working at SBB or as an SBB contractor, feel free to contact the ESTA GIS or G-Sharp teams to be guided trough this.

#### Simple map/3D scene display

The `@sbb-esta/angular-maps` components are the most simple way to integrate a map in your angular application - given the fact that you are able and willing to provide your data in and trough an ArcGIS portal. Chose this, if a map serves as additional way of displaying your data, giving an overview or a spatial insight. This provides basic means of panning and zooming out of the box and without further code.

If you are looking for a simple and fast way to show a map, without the overhead (and functionality) of the complete ArcGIS API for Javascript, you should opt for `@sbb-esta/angular-maps`. Using single services from ArcGIS platforms or any other source is easily done with this component.

#### Map/3D scene interaction

It's a common pattern to have the map display interacting with your application in a more advanced way. You might want to apply filters to data in your application at the same time as in your map (see [Layer filtering](/maps/advanced/layer-filtering)). You will be highlighting elements in the map depending on a selection in a data grid or you want to update the contents of your table based on the map extent current being shown (see [Accessing map data](/maps/advanced/accessing-map-data)).

Use the events emitted by the `@sbb-esta/angular-maps` components to interact with the map.

#### Map/3D scene synchronization

Imagine multiple map (and/or 3d scene) components being laid out in your application side by side, each displaying a different symbology, viewport or data layer. Panning and zooming in one map should also update the other map accordingly. This pattern lets you add a touch of not so common user experience to your application. Yet it can give a whole different feeling to your data and allows gaining additional insight.

### Alternatives

Using the `@sbb-esta/angular-maps` or `@sbb-esta/angular-maps-leaflet` components is free but using ArcGIS Online or an on premises portal will most likely have financial impact. The technology is tailored towards the SBB tech stack and allows a mix and match of data and technology when used in alignment with the tech governance. Still there might be reasons why not to use these components:

- For some reason, usage of the Geoportal is not possible or not wanted (the `@sbb-esta/angular-maps` roadmap includes an alternative meaning of how to define the content displayed by the map components but it's not there yet)
- ArcGIS API for Javascript does not provide a feature you need
- Performance, bandwidth usage or some other requirement is not met

To find alternatives, follow this strategy:

1. Determine if you could achieve your goals using the ArcGIS API for Javascript without `@sbb-esta/angular-maps` because of limitations introduced with the package. And check if you could work with `@sbb-esta/angular-maps-leaflet` instead.
2. See if there's a faster, smaller or more specific API or components in the Web development community that allows you to address your specific need. There might be means of still using the SBB geo data infrastructure if this is a requirement, possibly at the cost of additional code and logic that needs to be implemented.
3. Whatever you do or chose, consider upfront and repeating costs, know the amount of data and map-requests you will be serving. Pretty soon, Google Maps will not be an option anymore.

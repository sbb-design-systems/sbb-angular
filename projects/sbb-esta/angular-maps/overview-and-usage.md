# Overview and usage

TODO

- Why we created this package and what we address with the package.
- What problems the package solves
- What are the caveats/specifics (ArcGIS Portal usage)...

## Technology

The current implementation of `@sbb-esta/angular-maps` bases on the [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/) by [Esri](https://www.esri.com). The components provided in `@sbb-esta/angular-maps` are basically wrappers around the core functionality of the _ArcGIS API for Javascript_ with the intention to hide things like the [esri-loader](https://github.com/Esri/esri-loader) and ease the integration in Angular applications.

Currently, `@sbb-esta/angular-maps` bases on the _ArcGIS API for Javascript_ version _4.14_.

## What is ArcGIS Online / Portal for ArcGIS

From the [ArcGIS Online FAQ](https://doc.arcgis.com/en/arcgis-online/reference/faq.htm#anchor1):

> ArcGIS Online is a collaborative web GIS that allows you to use, create and share maps, scenes, apps, layers, analytics, and data. You get access to content in ArcGIS Living Atlas of the World, ArcGIS apps, and cloud infrastructure, where you can add items; publish web layers; and create maps, apps, and scenes. ArcGIS Online can be used as an integral part of the ArcGIS system, extending the capabilities of ArcGIS Pro, ArcGIS Enterprise, ArcGIS APIs, and ArcGIS Runtime SDKs.

_Portal for ArcGIS_ is the little "on premises" brother of ArcGIS Online. The [Get Started](https://enterprise.arcgis.com/en/portal/latest/use/what-is-portal-for-arcgis-.htm) of the ArcGIS Enterprise documentation puts it like this:

> The ArcGIS Enterprise portal is a component of ArcGIS Enterprise that allows you to share maps, scenes, apps, and other geographic information with other people in your organization. The front-end portal is powered by the back-end infrastructure of Portal for ArcGIS. The portal administrator can customize the portal to fit your organization's look and feel.

Both platforms allow the creation and publication of maps and scenes and can equally serve as a provider for the `@sbb-esta/angular-maps` components.

The SBB Geoportal (for company use only) is a _Portal for ArcGIS_ installation and provides much of the geo-content that is internally available. It is available at <https://geo.sbb.ch/portal.>

## Usage patterns

TODO

## Alternatives

Using the `@sbb-esta/angular-maps` components is free but using ArcGIS Online or an on premises portal will most likely have financial impact. The technology is tailored upon the SBB tech stack and allows a mix and match of data and technology when in use in alignment with the tech governance. Still there might be reasons why not to use these components:

- For some reason, usage of the Geoportal is not possible or not wanted (the `@sbb-esta/angular-maps` roadmap includes an alternative meaning of how to define the content displayed by the map components but it's not there yet)
- ArcGIS API for Javascript does not provide a feature you need
- Performance, bandwidth usage or some other requirement is not met

To find alternatives, follow this strategy:

1. Determine if you could achieve your goals using the ArcGIS API for Javascript without `@sbb-esta/angular-maps` because of limitations introduced with the package?
2. See if there's a faster, smaller or more specific API or components in the Web development community that allows you to address your specific need. There might be means of still using the SBB geo data infrastructure if this is a requirement.
3. Whatever you do or chose, consider upfront and repeating costs, know the amount of data and map-requests you will be serving. Pretty soon, Google Maps will not be an option anymore.

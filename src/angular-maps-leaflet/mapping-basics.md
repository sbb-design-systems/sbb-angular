# Mapping basics

Maps are a very relevant part of our daily routine. A few years ago, paper maps were all around. Today, map viewer applications provide all the details we need. 3D has become an important visual advantage for maps too.

> A map is almost universally a two-dimensional representation of a piece of three-dimensional space. Only with the advent of modern computer graphics were three-dimensional maps made possible. Maps serve two map functions; they are a spatial database and a communication device. The science of making maps is called cartography.

(_Quote from [Basics of a Map](https://www.gislounge.com/map/)_)

Maps are composed of a series of map layers drawn in a particular order. A map layer defines how a GIS dataset is symbolized and labeled in your map view.

![Typcial map layer composition](/assets/images/angular-maps/map_layers.jpg 'Typical map layer composition (image by United States Geological Survey [Public domain]')

From a technical point of view, maps in `@sbb-esta/angular-maps` and `@sbb-esta/angular-maps-leaflet` are composed of different layer types, representing different data sources. Details about this are laid out in our [Overview and usage](/maps-leaflet/introduction/overview-and-usage) section.

### Good maps

How can a good map be designed? What is _good design_ for maps anyway?

[GISgeography](https://gisgeography.com/) has a long list of questions and ideas to consider when diving into map making. Here's a small extract with important points as a start:

- Map has a clear purpose
- Use appropriate template and corporate style where available
- Use colors that reflect theme and purpose
- Ensure correct map extent and coverage
- Know your projection
- Order layers by importance
- Provide scale bars and legends
- Limit the number of features & elements on the map
- Beware of overlapping texts
- ...

The full list is at [33 Map Elements to Include in Cartographic Design: A ‘How to’ Guide to Map Making](https://gisgeography.com/map-elements-how-to-guide-map-making/).

### When to use maps

Using a map in your application can improve usability and ease access to complex data. Once you deal with spatial data and your application provides answers to location based questions you will end up using maps as a way to communicate. Furthermore, today everybody is used to read and handle maps in applications and thus, maps belong to standard UI toolkits.

The blog post [7 reasons why maps are important](https://web.archive.org/web/20170919140259/http://barrachd.co.uk/insights/blog/7-reasons-why-maps-are-important-in-data-analytics/) wraps up nicely why and when using maps is a great opportunity:

1. Simplification of complex patterns
2. Allow to gain a better insight to spatial patterns
3. Maps can be a journey of discovery
4. Geographical data adds a vital context
5. Add the chance to create conversation based on the look of your data
6. Tell better tales and stories with your data
7. Change your perspective and the way you think of your data

Maps are valuable, as long as you avoid a few common problems and mistakes when designing your application.

- Using maps only makes sense when location is a key part of what you want to provide or show.
- Do not overcrowd your map with information, chose a good symbology, provide scale dependend views
- Carefully craft your scrolling and panning interaction matching your device's default behaviour
- Consider the runtime environment of your application: Slow network have a huge impact on the responsiveness of your map

### Types of maps

Obvisouly, there are millions of variations of what a map can look like and what kind of information it provides. The composition of layers, their symbology and visual theme is what a makes a map unique. Still, there is a basic typology to consider:

- Political maps
- Physical maps
- Infrastructure maps (as in roads & highways, railways, ...)
- Topographic maps
- Geological maps
- Climate maps
- Economic or resource maps
- Other thematic maps

Most maps will be a combination of two or more of these types, aggregating information in layers.

### 2D vs. 3D

With `@sbb-esta/angular-maps` it's a simple task to integrate 2D and/or 3D scenes in your web application. But when should you be using a 2D map and when would you chose a 3D scene to provide the visual information and interaction patterns you aim for?

3D scenes allow to emphasize on the real world 3D situation, including terrain, buildings, infrastructure models. Think of BIM, digital twins, simulation and the ability to provide a unique visual communication towards your application users. 2D mapping however is what most people can relate to today. Navigation on a 2D map is usually much simpler and more intuitive.

Esri provides a thorough story map on when to use 2D and when to use 3D maps at [To 3D or not to 3D](https://storymaps.arcgis.com/stories/85df1e904cbb49c8ad169be4bc927016). Learn about eight things to consider when deciding on what kind of map you want to use.

### Further reading and references

This short _mapping basics_ article does not address many relevant questions when it comes to actual map making, cartography and visual communications using a map. For example, projections and symbology are key topics when creating good maps. Please help yourself to learn more about the art of map making.

A few starting points:

- [Basics of a Map](https://www.gislounge.com/map/) by GIS Lounge is a comprehensive article on everything you would need to know about 2D maps
- Esri's [Maps We Love](https://www.esri.com/en-us/maps-we-love/) comes with beautiful, useful and refreshing examples on how maps looks today. Be it 2D maps or interactive 3D maps, they got them all. Admittedly, it's Esri technology only
- The basics of map projection at the [Map projection](https://en.wikipedia.org/wiki/Map_projection) Wikipedia entry
- Esri has a few more good reads & books on these topics, among them are [The Art and Science of Cartography](https://www.esri.com/about/newsroom/arcuser/the-art-and-science-of-cartography/) and [Make Maps People Want to Look At](https://www.esri.com/news/arcuser/0112/make-maps-people-want-to-look-at.html)

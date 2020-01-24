# Basics of mapping

Maps are a very relevant part of our daily routine. A few years ago, paper maps were state of the art while today, map viewer applications provide all the details we need. 3D has become an important visual advantage for a map for some situation, too.

> A map is almost universally a two-dimensional representation of a piece of three-dimensional space. Only with the advent of modern computer graphics were three-dimensional maps made possible. Maps serve two map functions; they are a spatial database and a communication device. The science of making maps is called cartography.

(_Quote from [Basics of a Map](https://www.gislounge.com/map/)_)

[GISgeography](https://gisgeography.com/) has a great list of elements to consider and include when diving into map making. Here's a few important ones as a start:

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

## When to use maps

## Types of maps

Obvisouly, there are millions of variations of what a map can look like, and what kind of information it provides. The composition of layers, their symbology and visual theme is what a makes a map unique. Still, there are a few basic types as a start

- Political maps
- Physical maps
- Infrastructure maps (as in roads & highways, railways, ...)
- Topographic maps
- Geological maps
- Climate maps
- Economic or resource maps
- Other thematic maps

Most maps will be a combination of two or more of these types, aggregating information in layers.

## 2D vs. 3D

With `@sbb-esta/angular-maps` is very easy to integrate 2D and/or 3D scenes in your web application. But when should you be using a 2D map and when should you chose a 3D scene to transport the message you want to be providing?

3D scenes allow to emphasize on the real world 3D situation, including terrain, buildings, infrastructure models. Think of BIM, digital twins, simulation and the ability to provide a unique visual communication towards your application users.

Esri provides an great story map on when to use 2D and when to use 3D maps at [To 3D or not to 3D](https://storymaps.arcgis.com/stories/85df1e904cbb49c8ad169be4bc927016). Learn about eight things to consider when deciding on what kind of map you want to use.

## Further reading and map watching

This short mapping basics article does not address many relevant questions when it comes to actual map making, cartography and visual communications as a map. Projections and symbology are key topics when creating relevant maps.

- [Basics of a Map](https://www.gislounge.com/map/) by GIS Lounge is a comprehensive article on everything you would need to know about 2D maps
- Esri's [Maps We Love](https://www.esri.com/en-us/maps-we-love/) comes with beautiful, useful and refreshing examples on how maps looks today. Be it 2D maps or interactive 3D maps, they got them all. Admittedly, it's Esri technology only
- The basics of map projection at the [Map projection](https://en.wikipedia.org/wiki/Map_projection) Wikipedia entry
- Esri has a few more good reads & books on these topics, among them are [The Art and Science of Cartography](https://www.esri.com/about/newsroom/arcuser/the-art-and-science-of-cartography/) and [Make Maps People Want to Look At](https://www.esri.com/news/arcuser/0112/make-maps-people-want-to-look-at.html)

entryPoints = [
    "leaflet-map",
]

# List of all non-testing entry-points of the Leaflet package.
LEAFLET_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not "/testing" in ep
]

# List of all testing entry-points of the Leaflet package.
LEAFLET_TESTING_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not ep in LEAFLET_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Leaflet package.
LEAFLET_TARGETS = ["//src/angular-maps-leaflet"] + \
                  ["//src/angular-maps-leaflet/%s" % ep for ep in LEAFLET_ENTRYPOINTS]

# List of all testing entry-point targets of the angular-maps-leaflet package.
LEAFLET_TESTING_TARGETS = ["//src/angular-maps-leaflet/%s" % ep for ep in LEAFLET_TESTING_ENTRYPOINTS]

LEAFLET_MARKDOWN_TARGETS = [
    "leaflet-map",
]

"""
  Entry points list for journey-maps.
"""

entry_points = [
    # do not sort
    "angular",
    "esri-plugin",
]

# List of all non-testing entry-points of the Journey-maps package.
JOURNEY_MAPS_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not "/testing" in ep
]

# List of all testing entry-points of the Journey-maps package.
JOURNEY_MAPS_TESTING_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not ep in JOURNEY_MAPS_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Journey-maps package.
JOURNEY_MAPS_TARGETS = ["//src/journey-maps"] + \
                       ["//src/journey-maps/%s" % ep for ep in JOURNEY_MAPS_ENTRYPOINTS]

# List of all testing entry-point targets of the Journey-maps package.
JOURNEY_MAPS_TESTING_TARGETS = ["//src/journey-maps/%s" % ep for ep in JOURNEY_MAPS_TESTING_ENTRYPOINTS]

JOURNEY_MAPS_MARKDOWN_TARGETS = [
    "angular",
    "web-component",
    "esri-plugin",
]

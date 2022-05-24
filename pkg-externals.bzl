"""
  Package version management. These are used for replacement in built bundles.
"""

load("//src/angular:config.bzl", "ANGULAR_ENTRYPOINTS")
load("//src/angular-maps:config.bzl", "MAPS_ENTRYPOINTS")
load("//src/journey-maps:config.bzl", "JOURNEY_MAPS_ENTRYPOINTS")

# Base list of externals which should not be bundled into the APF package output.
# Note that we want to disable sorting of the externals as we manually group entries.
# buildifier: disable=unsorted-list-items
PKG_EXTERNALS = [
    # Framework packages.
    "@angular/animations",
    "@angular/common",
    "@angular/common/http",
    "@angular/common/http/testing",
    "@angular/common/testing",
    "@angular/core",
    "@angular/core/testing",
    "@angular/forms",
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    "@angular/platform-browser-dynamic/testing",
    "@angular/platform-browser/animations",
    "@angular/platform-server",
    "@angular/router",
    "@angular/cdk",
    "@angular/cdk/a11y",
    "@angular/cdk/accordion",
    "@angular/cdk/bidi",
    "@angular/cdk/clipboard",
    "@angular/cdk/coercion",
    "@angular/cdk/collections",
    "@angular/cdk/drag-drop",
    "@angular/cdk/keycodes",
    "@angular/cdk/layout",
    "@angular/cdk/observers",
    "@angular/cdk/overlay",
    "@angular/cdk/platform",
    "@angular/cdk/portal",
    "@angular/cdk/scrolling",
    "@angular/cdk/stepper",
    "@angular/cdk/table",
    "@angular/cdk/text-field",
    "@angular/cdk/tree",

    # Primary entry-points in the project.
    "@sbb-esta/angular",
    "@sbb-esta/angular-maps",
    "@sbb-esta/journey-maps",

    # Third-party libraries.
    "@arcgis/core/Camera",
    "@arcgis/core/Graphic",
    "@arcgis/core/WebMap",
    "@arcgis/core/WebScene",
    "@arcgis/core/config",
    "@arcgis/core/geometry/Extent",
    "@arcgis/core/geometry/Point",
    "@arcgis/core/layers/FeatureLayer",
    "@arcgis/core/symbols/SimpleMarkerSymbol",
    "@arcgis/core/views/MapView",
    "@arcgis/core/views/SceneView",
    "@arcgis/core/widgets/BasemapGallery",
    "@arcgis/core/widgets/LayerList",
    "@arcgis/core/widgets/Legend",
    "protractor",
    "rxjs",
    "rxjs/operators",
    "keycloak-js",
    "maplibre-gl",
]

# Creates externals for a given package and its entry-points.
def setup_entry_point_externals(packageName, entryPoints):
    PKG_EXTERNALS.extend(["@sbb-esta/%s/%s" % (packageName, ep) for ep in entryPoints])

setup_entry_point_externals("angular", ANGULAR_ENTRYPOINTS)
setup_entry_point_externals("angular-maps", MAPS_ENTRYPOINTS)
setup_entry_point_externals("journey-maps", JOURNEY_MAPS_ENTRYPOINTS)

# External module names in the examples package. Individual examples are grouped
# by package and component, so we add configure such entry-points as external.
setup_entry_point_externals("components-examples/angular", ANGULAR_ENTRYPOINTS)
setup_entry_point_externals("components-examples/angular-maps", MAPS_ENTRYPOINTS)
setup_entry_point_externals("components-examples/journey-maps", JOURNEY_MAPS_ENTRYPOINTS)

"""
  Package version management. These are used for replacement in built bundles.
"""

load("//src/angular:config.bzl", "ANGULAR_ENTRYPOINTS")
load("//src/angular-maps:config.bzl", "MAPS_ENTRYPOINTS")

# Base rollup globals for everything in the repo. Note that we want to disable
# sorting of the globals as we manually group dict entries.
# buildifier: disable=unsorted-dict-items
ROLLUP_GLOBALS = {
    # Framework packages.
    "@angular/animations": "ng.animations",
    "@angular/common": "ng.common",
    "@angular/common/http": "ng.common.http",
    "@angular/common/http/testing": "ng.common.http.testing",
    "@angular/common/testing": "ng.common.testing",
    "@angular/core": "ng.core",
    "@angular/core/testing": "ng.core.testing",
    "@angular/forms": "ng.forms",
    "@angular/platform-browser": "ng.platformBrowser",
    "@angular/platform-browser-dynamic": "ng.platformBrowserDynamic",
    "@angular/platform-browser-dynamic/testing": "ng.platformBrowserDynamic.testing",
    "@angular/platform-browser/animations": "ng.platformBrowser.animations",
    "@angular/platform-server": "ng.platformServer",
    "@angular/router": "ng.router",
    "@angular/cdk": "ng.cdk",
    "@angular/cdk/a11y": "ng.cdk.a11y",
    "@angular/cdk/accordion": "ng.cdk.accordion",
    "@angular/cdk/bidi": "ng.cdk.bidi",
    "@angular/cdk/clipboard": "ng.cdk.clipboard",
    "@angular/cdk/coercion": "ng.cdk.coercion",
    "@angular/cdk/collections": "ng.cdk.collections",
    "@angular/cdk/drag-drop": "ng.cdk.drag-drop",
    "@angular/cdk/keycodes": "ng.cdk.keycodes",
    "@angular/cdk/layout": "ng.cdk.layout",
    "@angular/cdk/observers": "ng.cdk.observers",
    "@angular/cdk/overlay": "ng.cdk.overlay",
    "@angular/cdk/platform": "ng.cdk.platform",
    "@angular/cdk/portal": "ng.cdk.portal",
    "@angular/cdk/scrolling": "ng.cdk.scrolling",
    "@angular/cdk/stepper": "ng.cdk.stepper",
    "@angular/cdk/table": "ng.cdk.table",
    "@angular/cdk/text-field": "ng.cdk.text-field",
    "@angular/cdk/tree": "ng.cdk.tree",

    # Third-party libraries.
    "@arcgis/core/Camera": "arcgis.core.Camera",
    "@arcgis/core/Graphic": "arcgis.core.Graphic",
    "@arcgis/core/WebMap": "arcgis.core.WebMap",
    "@arcgis/core/WebScene": "arcgis.core.WebScene",
    "@arcgis/core/config": "arcgis.core.config",
    "@arcgis/core/geometry/Extent": "arcgis.core.geometry.Extent",
    "@arcgis/core/geometry/Point": "arcgis.core.geometry.Point",
    "@arcgis/core/layers/FeatureLayer": "arcgis.core.layers.FeatureLayer",
    "@arcgis/core/symbols/SimpleMarkerSymbol": "arcgis.core.symbols.SimpleMarkerSymbol",
    "@arcgis/core/views/MapView": "arcgis.core.views.MapView",
    "@arcgis/core/views/SceneView": "arcgis.core.views.SceneView",
    "@arcgis/core/widgets/BasemapGallery": "arcgis.core.widgets.BasemapGallery",
    "@arcgis/core/widgets/LayerList": "arcgis.core.widgets.LayerList",
    "@arcgis/core/widgets/Legend": "arcgis.core.widgets.Legend",
    "protractor": "protractor",
    "rxjs": "rxjs",
    "rxjs/operators": "rxjs.operators",
    "keycloak-js": "keycloak",
}

# Converts a string from dash-case to lower camel case.
def to_camel_case(input):
    segments = input.split("-")
    return segments[0] + "".join([x.title() for x in segments[1:]])

# Converts an entry-point name to a UMD module name.
# e.g. "snack-bar/testing" will become "snackBar.testing".
def to_umd_name(name):
    segments = name.split("/")
    return ".".join([to_camel_case(x) for x in segments])

# Creates globals for a given package and its entry-points.
def create_globals(packageName, entryPoints):
    ROLLUP_GLOBALS.update({
        "@sbb-esta/%s/%s" % (packageName, ep): "ng.%s.%s" % (to_umd_name(packageName), to_umd_name(ep))
        for ep in entryPoints
    })

create_globals("angular", ANGULAR_ENTRYPOINTS)
create_globals("angular-maps", MAPS_ENTRYPOINTS)

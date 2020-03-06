load("//src/business:config.bzl", "BUSINESS_ENTRYPOINTS")
load("//src/core:config.bzl", "CORE_ENTRYPOINTS")
load("//src/icons:config.bzl", "ICONS_ENTRYPOINTS")
load("//src/keycloak:config.bzl", "KEYCLOAK_ENTRYPOINTS")
load("//src/maps:config.bzl", "MAPS_ENTRYPOINTS")
load("//src/public:config.bzl", "PUBLIC_ENTRYPOINTS")

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

    # Third-party libraries.
    "ngx-perfect-scrollbar": "ngxPerfectScrollbar",
    "protractor": "protractor",
    "rxjs": "rxjs",
    "rxjs/operators": "rxjs.operators",
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
        "@sbb-esta/angular-%s/%s" % (packageName, ep): "ng.%s.%s" % (to_umd_name(packageName), to_umd_name(ep))
        for ep in entryPoints
    })

create_globals("business", BUSINESS_ENTRYPOINTS)
create_globals("core", CORE_ENTRYPOINTS)
create_globals("icons", ICONS_ENTRYPOINTS)
create_globals("keycloak", KEYCLOAK_ENTRYPOINTS)
create_globals("maps", MAPS_ENTRYPOINTS)
create_globals("public", PUBLIC_ENTRYPOINTS)

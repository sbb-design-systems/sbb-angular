"""
  Entry points list for examples.
"""

ALL_EXAMPLES = [
    # TODO(devversion): try to have for each entry-point a bazel package so that
    # we can automate this using the "package.bzl" variables. Currently generated
    # with "bazel query 'kind("ng_project", //src/components-examples/...:*)' --output="label"
    "//src/components-examples/angular/accordion",
    "//src/components-examples/angular/alert",
    "//src/components-examples/angular/autocomplete",
    "//src/components-examples/angular/badge",
    "//src/components-examples/angular/breadcrumb",
    "//src/components-examples/angular/button",
    "//src/components-examples/angular/captcha",
    "//src/components-examples/angular/checkbox",
    "//src/components-examples/angular/checkbox-panel",
    "//src/components-examples/angular/chips",
    "//src/components-examples/angular/datepicker",
    "//src/components-examples/angular/dialog",
    "//src/components-examples/angular/file-selector",
    "//src/components-examples/angular/form-field",
    "//src/components-examples/angular/icon",
    "//src/components-examples/angular/input",
    "//src/components-examples/angular/lightbox",
    "//src/components-examples/angular/loading-indicator",
    "//src/components-examples/angular/menu",
    "//src/components-examples/angular/notification",
    "//src/components-examples/angular/notification-toast",
    "//src/components-examples/angular/pagination",
    "//src/components-examples/angular/processflow",
    "//src/components-examples/angular/radio-button",
    "//src/components-examples/angular/radio-button-panel",
    "//src/components-examples/angular/search",
    "//src/components-examples/angular/select",
    "//src/components-examples/angular/sidebar",
    "//src/components-examples/angular/status",
    "//src/components-examples/angular/table",
    "//src/components-examples/angular/tabs",
    "//src/components-examples/angular/tag",
    "//src/components-examples/angular/textarea",
    "//src/components-examples/angular/textexpand",
    "//src/components-examples/angular/time-input",
    "//src/components-examples/angular/toggle",
    "//src/components-examples/angular/tooltip",
    "//src/components-examples/angular/usermenu",
    "//src/components-examples/angular-experimental/example",
    "//src/components-examples/journey-maps/angular",
    "//src/components-examples/journey-maps/esri-plugin",
]

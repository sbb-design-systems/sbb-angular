"""
  Entry points list for angular.
"""

entry_points = [
    # do not sort
    "accordion",
    "alert",
    "autocomplete",
    "badge",
    "breadcrumb",
    "button",
    "captcha",
    "checkbox",
    "checkbox-panel",
    "chips",
    "core",
    "core/testing",
    "core/testing/lean-polyfill",
    "datepicker",
    "dialog",
    "file-selector",
    "form-field",
    "header-lean",
    "i18n",
    "icon",
    "icon/testing",
    "input",
    "lightbox",
    "loading-indicator",
    "menu",
    "notification",
    "notification-toast",
    "pagination",
    "processflow",
    "radio-button",
    "radio-button-panel",
    "search",
    "select",
    "sidebar",
    "status",
    "table",
    "tabs",
    "tag",
    "textarea",
    "textexpand",
    "time-input",
    "toggle",
    "tooltip",
    "usermenu",
]

# List of all non-testing entry-points of the Angular package.
ANGULAR_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not "/testing" in ep
]

# List of all testing entry-points of the Angular package.
ANGULAR_TESTING_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not ep in ANGULAR_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Angular package.
ANGULAR_TARGETS = ["//src/angular"] + \
                  ["//src/angular/%s" % ep for ep in ANGULAR_ENTRYPOINTS]

# List of all testing entry-point targets of the Angular package.
ANGULAR_TESTING_TARGETS = ["//src/angular/%s" % ep for ep in ANGULAR_TESTING_ENTRYPOINTS]

ANGULAR_MARKDOWN_TARGETS = [
    "accordion",
    "alert",
    "autocomplete",
    "badge",
    "breadcrumb",
    "button",
    "captcha",
    "checkbox",
    "checkbox-panel",
    "chips",
    "datepicker",
    "dialog",
    "file-selector",
    "form-field",
    "header-lean",
    "icon",
    "input",
    "lightbox",
    "loading-indicator",
    "menu",
    "notification",
    "notification-toast",
    "pagination",
    "processflow",
    "radio-button",
    "radio-button-panel",
    "search",
    "select",
    "sidebar",
    "status",
    "table",
    "tabs",
    "tag",
    "textarea",
    "textexpand",
    "time-input",
    "toggle",
    "tooltip",
    "usermenu",
]

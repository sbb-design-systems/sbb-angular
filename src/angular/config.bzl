"""
  Entry points list for angular.
"""

entry_points = [
    # do not sort
    "accordion",
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
    "datepicker",
    "dialog",
    "file-selector",
    "form-field",
    "icon",
    "icon/testing",
    "lightbox",
    "loading",
    "menu",
    "oauth",
    "pagination",
    "processflow",
    "radio-button",
    "radio-button-panel",
    "search",
    "select",
    "sidebar",
    "status",
    "tabs",
    "tag",
    "textarea",
    "textexpand",
    "time-input",
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
    "icon",
    "lightbox",
    "loading",
    "menu",
    "oauth",
    "pagination",
    "processflow",
    "radio-button",
    "radio-button-panel",
    "search",
    "select",
    "sidebar",
    "status",
    "tabs",
    "tag",
    "textarea",
    "textexpand",
    "time-input",
]

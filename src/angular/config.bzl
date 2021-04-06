"""
  Entry points list for angular.
"""

entry_points = [
    # do not sort
    "accordion",
    "autocomplete",
    "button",
    "captcha",
    "checkbox",
    "checkbox-panel",
    "core",
    "core/testing",
    "file-selector",
    "form-field",
    "icon",
    "icon/testing",
    "loading",
    "oauth",
    "radio-button",
    "radio-button-panel",
    "select",
    "sidebar",
    "status",
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
    "button",
    "captcha",
    "checkbox",
    "checkbox-panel",
    "file-selector",
    "form-field",
    "icon",
    "loading",
    "oauth",
    "radio-button",
    "radio-button-panel",
    "select",
    "sidebar",
    "status",
    "textarea",
    "textexpand",
    "time-input",
]

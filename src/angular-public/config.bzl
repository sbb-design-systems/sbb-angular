"""
  Entry points list for public.
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
    "datepicker",
    "dropdown",
    "file-selector",
    "form-field",
    "ghettobox",
    "input",
    "lightbox",
    "links",
    "loading",
    "notification",
    "option",
    "pagination",
    "processflow",
    "radio-button",
    "radio-button-panel",
    "search",
    "select",
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

# List of all non-testing entry-points of the Public package.
PUBLIC_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not "/testing" in ep
]

# List of all testing entry-points of the Public package.
PUBLIC_TESTING_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not ep in PUBLIC_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Public package.
PUBLIC_TARGETS = ["//src/angular-public"] + \
                 ["//src/angular-public/%s" % ep for ep in PUBLIC_ENTRYPOINTS]

# List of all testing entry-point targets of the Angular-public package.
PUBLIC_TESTING_TARGETS = ["//src/angular-public/%s" % ep for ep in PUBLIC_TESTING_ENTRYPOINTS]

PUBLIC_MARKDOWN_TARGETS = [
    "accordion",
    "autocomplete",
    "badge",
    "breadcrumb",
    "button",
    "captcha",
    "checkbox",
    "checkbox-panel",
    "datepicker",
    "dropdown",
    "file-selector",
    "form-field",
    "ghettobox",
    "lightbox",
    "links",
    "loading",
    "notification",
    "pagination",
    "processflow",
    "radio-button",
    "radio-button-panel",
    "search",
    "select",
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

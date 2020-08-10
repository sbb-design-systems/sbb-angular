entryPoints = [
    # do not sort
    "accordion",
    "autocomplete",
    "badge",
    "breadcrumb",
    "button",
    "checkbox",
    "chip",
    "contextmenu",
    "datepicker",
    "dialog",
    "dropdown",
    "field",
    "file-selector",
    "header",
    "input",
    "links",
    "loading",
    "notification",
    "notification-toast",
    "option",
    "pagination",
    "processflow",
    "radio-button",
    "select",
    "status",
    "table",
    "tabs",
    "textarea",
    "textexpand",
    "time-input",
    "tooltip",
    "usermenu",
]

# List of all non-testing entry-points of the Business package.
BUSINESS_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not "/testing" in ep
]

# List of all testing entry-points of the Business package.
BUSINESS_TESTING_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not ep in BUSINESS_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Business package.
BUSINESS_TARGETS = ["//src/angular-business"] + \
                   ["//src/angular-business/%s" % ep for ep in BUSINESS_ENTRYPOINTS]

# List of all testing entry-point targets of the Angular-business package.
BUSINESS_TESTING_TARGETS = ["//src/angular-business/%s" % ep for ep in BUSINESS_TESTING_ENTRYPOINTS]

BUSINESS_MARKDOWN_TARGETS = [
    "accordion",
    "autocomplete",
    "badge",
    "breadcrumb",
    "button",
    "checkbox",
    "chip",
    "contextmenu",
    "datepicker",
    "dialog",
    "dropdown",
    "field",
    "file-selector",
    "header",
    "links",
    "loading",
    "notification",
    "notification-toast",
    "pagination",
    "processflow",
    "radio-button",
    "select",
    "status",
    "table",
    "tabs",
    "textarea",
    "textexpand",
    "time-input",
    "tooltip",
    "usermenu",
]

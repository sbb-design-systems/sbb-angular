entryPoints = [
  "accordion",
  "autocomplete",
  "badge",
  "button",
  "checkbox",
  "chip",
  "contextmenu",
  "datepicker",
  "dialog",
  "dropdown",
  "field",
  "header",
  "input",
  "notification",
  "option",
  "pagination",
  "processflow",
  "radio-button",
  "select",
  "table",
  "tabs",
  "textarea",
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
BUSINESS_TARGETS = ["//src/business"] + \
                   ["//src/business/%s" % ep for ep in BUSINESS_ENTRYPOINTS]

# List of all testing entry-point targets of the Business package.
BUSINESS_TESTING_TARGETS = ["//src/business/%s" % ep for ep in BUSINESS_TESTING_ENTRYPOINTS]

BUSINESS_MARKDOWN_TARGETS = [
  "accordion",
  "autocomplete",
  "badge",
  "button",
  "checkbox",
  "chip",
  "contextmenu",
  "datepicker",
  "dialog",
  "dropdown",
  "field",
  "header",
  "notification",
  "pagination",
  "processflow",
  "radio-button",
  "select",
  "table",
  "tabs",
  "textarea",
  "time-input",
  "tooltip",
  "usermenu",
]
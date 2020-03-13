entryPoints = [
  "button",
  "checkbox",
  "chip",
  "contextmenu",
  "dialog",
  "header",
  "notification",
  "processflow",
  "table",
  "tooltip",
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
  "button",
  "checkbox",
  "chip",
  "contextmenu",
  "dialog",
  "header",
  "notification",
  "processflow",
  "table",
  "tooltip",
]
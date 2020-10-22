entryPoints = [
    # do not sort
    "base",
    "base/checkbox",
    "base/processflow",
    "base/tooltip",
    "breakpoints",
    "common-behaviors",
    "datetime",
    "error",
    "forms",
    "icon",
    "icon/testing",
    "icon-directive",
    "models",
    "oauth",
    "radio-button",
    "testing",
]

# List of all non-testing entry-points of the Core package.
CORE_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not "/testing" in ep
]

# List of all testing entry-points of the Core package.
CORE_TESTING_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not ep in CORE_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Core package.
CORE_TARGETS = ["//src/angular-core"] + \
               ["//src/angular-core/%s" % ep for ep in CORE_ENTRYPOINTS]

# List of all testing entry-point targets of the Angular-core package.
CORE_TESTING_TARGETS = ["//src/angular-core/%s" % ep for ep in CORE_TESTING_ENTRYPOINTS]

CORE_MARKDOWN_TARGETS = [
    "breakpoints",
    "datetime",
    "icon",
    "oauth",
]

entryPoints = [
    # do not sort
    "autocomplete",
    "captcha",
    "checkbox",
    "core",
    "core/testing",
    "form-field",
    "icon",
    "icon/testing",
    "loading",
    "oauth",
    "radio-button",
    "select",
    "textarea",
]

# List of all non-testing entry-points of the Angular package.
ANGULAR_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not "/testing" in ep
]

# List of all testing entry-points of the Angular package.
ANGULAR_TESTING_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not ep in ANGULAR_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Angular package.
ANGULAR_TARGETS = ["//src/angular"] + \
                  ["//src/angular/%s" % ep for ep in ANGULAR_ENTRYPOINTS]

# List of all testing entry-point targets of the Angular package.
ANGULAR_TESTING_TARGETS = ["//src/angular/%s" % ep for ep in ANGULAR_TESTING_ENTRYPOINTS]

ANGULAR_MARKDOWN_TARGETS = [
    "autocomplete",
    "captcha",
    "checkbox",
    "form-field",
    "icon",
    "loading",
    "oauth",
    "radio-button",
    "select",
    "textarea",
]

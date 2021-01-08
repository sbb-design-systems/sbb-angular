entryPoints = [
    # do not sort
    "angular/loading",
]

# List of all non-testing entry-points of the Examples package.
EXAMPLES_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not "/testing" in ep
]

# List of all testing entry-points of the Examples package.
EXAMPLES_TESTING_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not ep in EXAMPLES_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Examples package.
EXAMPLES_TARGETS = ["//src/components-examples"] + \
                   ["//src/components-examples/%s" % ep for ep in EXAMPLES_ENTRYPOINTS]

# List of all testing entry-point targets of the Components-examples package.
EXAMPLES_TESTING_TARGETS = ["//src/components-examples/%s" % ep for ep in EXAMPLES_TESTING_ENTRYPOINTS]

EXAMPLES_MARKDOWN_TARGETS = [
]

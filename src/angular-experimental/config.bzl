"""
  Entry points list for experimental.
"""

entry_points = [
    # do not sort
    "example",
]

# List of all non-testing entry-points of the Experimental package.
EXPERIMENTAL_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not "/testing" in ep
]

# List of all testing entry-points of the Experimental package.
EXPERIMENTAL_TESTING_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not ep in EXPERIMENTAL_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Experimental package.
EXPERIMENTAL_TARGETS = ["//src/angular-experimental"] + \
                       ["//src/angular-experimental/%s" % ep for ep in EXPERIMENTAL_ENTRYPOINTS]

# List of all testing entry-point targets of the Angular-experimental package.
EXPERIMENTAL_TESTING_TARGETS = ["//src/angular-experimental/%s" % ep for ep in EXPERIMENTAL_TESTING_ENTRYPOINTS]

EXPERIMENTAL_MARKDOWN_TARGETS = [
    "example",
]

entryPoints = [
    # do not sort
]

# List of all non-testing entry-points of the Keycloak package.
KEYCLOAK_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not "/testing" in ep
]

# List of all testing entry-points of the Keycloak package.
KEYCLOAK_TESTING_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not ep in KEYCLOAK_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the Keycloak package.
KEYCLOAK_TARGETS = ["//src/angular-keycloak"] + \
                   ["//src/angular-keycloak/%s" % ep for ep in KEYCLOAK_ENTRYPOINTS]

# List of all testing entry-point targets of the Angular-keycloak package.
KEYCLOAK_TESTING_TARGETS = ["//src/angular-keycloak/%s" % ep for ep in KEYCLOAK_TESTING_ENTRYPOINTS]

KEYCLOAK_MARKDOWN_TARGETS = [
]

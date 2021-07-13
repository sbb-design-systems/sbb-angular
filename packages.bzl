"""
  Package version management. These are used for replacement in built bundles.
"""

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = "^12.0.0-0 || ^13.0.0-0"
CDK_PACKAGE_VERSION = "^12.0.0-0"
TSLIB_PACKAGE_VERSION = "^2.2.0"

# Each placer holder is used to stamp versions during the build process, replacing the key with it's
# value pair. These replacements occur during building of `npm_package` and `ng_package` stamping in
# the peer dependencies and versions, primarily in `package.json`s.
VERSION_PLACEHOLDER_REPLACEMENTS = {
    # Version of `@angular/cdk`
    "0.0.0-CDK": CDK_PACKAGE_VERSION,
    # Version of `@angular/core`
    "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
    # Version of the local package being built, generated via the `--workspace_status_command` flag.
    "0.0.0-PLACEHOLDER": "{BUILD_SCM_VERSION}",
    # Version of `tslib`
    "0.0.0-TSLIB": TSLIB_PACKAGE_VERSION,
}

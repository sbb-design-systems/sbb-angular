"""
  No docs.
"""

load("@aspect_bazel_lib//lib:copy_to_bin.bzl", "copy_to_bin")
load("@rules_angular//src/architect:ng_application.bzl", "ng_application")

# NOTE:
#  *_DEPS are runtime dependencies
#  *_CONFIG are tools and their dependencies

# Global dependencies such as common config files, tools
COMMON_CONFIG = [
    "//src/journey-maps-wc:ng-base-config",

    # Required for angular.json reference to '@angular/cli/lib/config/schema.json'
    "//src/journey-maps-wc:node_modules/@angular/cli",

    # builders referenced from angular.json
    "//src/journey-maps-wc:node_modules/@angular-devkit/build-angular",
]

# Project dependencies common across libs/tests
DEPS = [
    "//src/journey-maps-wc:node_modules/@sbb-esta/angular",
    "//src/journey-maps-wc:node_modules/@sbb-esta/journey-maps",
    "//src/journey-maps-wc:node_modules/maplibre-gl",
]

# Common dependencies of Angular CLI applications
APPLICATION_CONFIG = COMMON_CONFIG + [
    ":ng-app-config",
]

# buildifier: disable=unused-variable
def ng_app(name, project_name = None, deps = [], test_deps = [], e2e_deps = [], **kwargs):
    """
    Macro for Angular applications, creating various targets aligning with the Angular CLI.

    For a given application targets are created aligning with Angular CLI commands.
    CLI commands can be found in angular.json at `project.[project].architect.[command]`.
    Additional targets may be created from different command configurations such as `build.production`.

    Args:
      name: the rule name
      project_name: the Angular CLI project name, to the rule name
      deps: dependencies of the library
      test_deps: additional dependencies for tests
      e2e_deps: additional dependencies for e2e tests
      **kwargs: extra args passed to main Angular CLI rules
    """
    srcs = native.glob(
        ["src/**/*"],
        exclude = [
            "src/**/*.spec.ts",
            "src/test.ts",
        ],
    )

    test_srcs = native.glob(["src/test.ts", "src/**/*.spec.ts"])

    tags = kwargs.pop("tags", [])

    # config files
    copy_to_bin(
        name = "ng-app-config",
        srcs = [
            "tsconfig.app.json",
        ],
        visibility = ["//visibility:private"],
    )
    copy_to_bin(
        name = "ng-test-config",
        srcs = [
            "karma.conf.js",
            "tsconfig.spec.json",
        ],
        visibility = ["//visibility:private"],
    )

    project_name = project_name if project_name else name

    native.alias(
        name = name,
        actual = "build.production",
    )

    _architect_build(
        project_name,
        srcs = srcs + deps + DEPS + APPLICATION_CONFIG,
        tags = tags + ["manual"],
        **kwargs
    )
    _architect_build(
        project_name,
        srcs = srcs + deps + DEPS + APPLICATION_CONFIG,
        configuration = "production",
        tags = tags,
        **kwargs
    )

def _architect_build(project_name, configuration = None, args = [], srcs = [], **kwargs):
    args = []

    if configuration != None:
        args += ["--configuration", configuration]

    ng_application(
        name = "%s%s" % ("build", ".%s" % configuration if configuration else ""),
        ng_config = "//src/journey-maps-wc:config",
        node_modules = "//src/journey-maps-wc:node_modules",
        project_name = project_name,
        args = args,
        # Needed for font inlining.
        execution_requirements = {"requires-network": "1"},
        srcs = srcs,
        **kwargs
    )

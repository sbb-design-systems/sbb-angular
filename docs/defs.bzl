"""
  No docs.
"""

load("@rules_angular//src/architect:ng_application.bzl", "ng_application")
load("@rules_angular//src/architect:ng_test.bzl", "ng_test")
load("@aspect_bazel_lib//lib:copy_to_bin.bzl", "copy_to_bin")

# NOTE:
#  *_DEPS are runtime dependencies
#  *_CONFIG are tools and their dependencies

# Global dependencies such as common config files, tools
COMMON_CONFIG = [
    "//docs:ng-base-config",

    # Required for angular.json reference to '@angular/cli/lib/config/schema.json'
    "//docs:node_modules/@angular/cli",

    # builders referenced from angular.json
    "//docs:node_modules/@angular-devkit/build-angular",
]

# Project dependencies common across libs/tests
DEPS = [
    "//docs:node_modules/@sbb-esta/angular",
    "//docs:node_modules/@sbb-esta/angular-experimental",
    "//docs:node_modules/@sbb-esta/journey-maps",
    "//docs:node_modules/@sbb-esta/journey-maps-wc",
]

# Common dependencies of Angular CLI applications
APPLICATION_CONFIG = COMMON_CONFIG + [
    ":ng-app-config",
]

TEST_DEPS = [
    "@rules_browsers//src/browsers/chromium",
    "@rules_browsers//src/browsers/firefox",
    "//docs:node_modules/karma-firefox-launcher",
]

# Common dependencies of Angular CLI test suites
TEST_CONFIG = COMMON_CONFIG + [
    "//docs:ng-base-test-config",
    ":ng-test-config",
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

    _architect_test(
        project_name,
        "test",
        args = ["--no-watch"],
        srcs = srcs + test_srcs + deps + test_deps + DEPS + TEST_DEPS + TEST_CONFIG,
        tags = tags,
        **kwargs
    )

def _architect_build(project_name, configuration = None, args = [], srcs = [], **kwargs):
    args = []

    if configuration != None:
        args += ["--configuration", configuration]

    ng_application(
        name = "%s%s" % ("build", ".%s" % configuration if configuration else ""),
        ng_config = "//docs:config",
        node_modules = "//docs:node_modules",
        project_name = project_name,
        args = args,
        # Needed for font inlining.
        execution_requirements = {"requires-network": "1"},
        srcs = srcs,
        **kwargs
    )

def _architect_test(project_name, command, configuration = None, args = [], srcs = [], **kwargs):
    to_root = ""
    if native.package_name() != "":
        to_root = "".join(["../" for _ in native.package_name().split("/")])

    args = []
    if configuration != None:
        args += ["--configuration", configuration]

    env = {
        "CHROME_BIN": to_root + "$(CHROME-HEADLESS-SHELL)",
        "CHROMEDRIVER_BIN": to_root + "$(CHROMEDRIVER)",
    }

    ng_test(
        name = "%s%s" % (command, ".%s" % configuration if configuration else ""),
        args = args,
        project_name = project_name,
        ng_config = "//docs:config",
        node_modules = "//docs:node_modules",
        srcs = srcs,
        env = env,
        toolchains = [
            "@rules_browsers//src/browsers/chromium:toolchain_alias",
            "@rules_browsers//src/browsers/firefox:toolchain_alias",
        ],
        **kwargs
    )

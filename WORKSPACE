# Before making any changes, please read Bazel documentation.
# https://docs.bazel.build/versions/master/be/workspace.html
# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(
    name = "sbb_angular",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "94070eff79305be05b7699207fbac5d2608054dd53e6109f7d00d923919ff45a",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.8.2/rules_nodejs-5.8.2.tar.gz"],
)

# Add sass rules
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "4b6153ae6c454c5bd44f3e47e5430f8a634d4affb983a237d21ca6199e13991c",
    strip_prefix = "rules_sass-1.50.1",
    urls = [
        "https://github.com/bazelbuild/rules_sass/archive/1.50.1.zip",
    ],
)

# Add skylib which contains common Bazel utilities. Note that `rules_nodejs` would also
# bring in the skylib repository but with an older version that does not support shorthands
# for declaring Bazel build setting flags.
http_archive(
    name = "bazel_skylib",
    sha256 = "a9c5d3a22461ed7063aa7b088f9c96fa0aaaa8b6984b601f84d705adc47d8a58",
    strip_prefix = "bazel-skylib-8334f938c1574ef6f1f7a38a03550a31df65274e",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/archive/8334f938c1574ef6f1f7a38a03550a31df65274e.tar.gz",
    ],
)

http_archive(
    name = "rules_pkg",
    sha256 = "a89e203d3cf264e564fcb96b6e06dd70bc0557356eb48400ce4b5d97c2c3720d",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_pkg/releases/download/0.5.1/rules_pkg-0.5.1.tar.gz",
        "https://github.com/bazelbuild/rules_pkg/releases/download/0.5.1/rules_pkg-0.5.1.tar.gz",
    ],
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

load("@build_bazel_rules_nodejs//:repositories.bzl", "build_bazel_rules_nodejs_dependencies")

build_bazel_rules_nodejs_dependencies()

load("@rules_nodejs//nodejs:repositories.bzl", "nodejs_register_toolchains")

nodejs_register_toolchains(
    name = "nodejs",
    node_repositories = {
        "18.19.1-darwin_arm64": ("node-v18.19.1-darwin-arm64.tar.gz", "node-v18.19.1-darwin-arm64", "0c7249318868877032ed21cc0ed450015ee44b31b9b281955521cd3fc39fbfa3"),
        "18.19.1-darwin_amd64": ("node-v18.19.1-darwin-x64.tar.gz", "node-v18.19.1-darwin-x64", "ab67c52c0d215d6890197c951e1bd479b6140ab630212b96867395e21d813016"),
        "18.19.1-linux_arm64": ("node-v18.19.1-linux-arm64.tar.xz", "node-v18.19.1-linux-arm64", "228ad1eee660fba3f9fd2cccf02f05b8ebccc294d27f22c155d20b233a9d76b3"),
        "18.19.1-linux_ppc64le": ("node-v18.19.1-linux-ppc64le.tar.xz", "node-v18.19.1-linux-ppc64le", "2e5812b8fc00548e2e8ab9daa88ace13974c16b6ba5595a7a50c35f848f7d432"),
        "18.19.1-linux_s390x": ("node-v18.19.1-linux-s390x.tar.xz", "node-v18.19.1-linux-s390x", "15106acf4c9e3aca02416dd89fb5c71af77097042455a73f9caa064c1988ead5"),
        "18.19.1-linux_amd64": ("node-v18.19.1-linux-x64.tar.xz", "node-v18.19.1-linux-x64", "f35f24edd4415cd609a2ebc03be03ed2cfe211d7333d55c752d831754fb849f0"),
        "18.19.1-windows_amd64": ("node-v18.19.1-win-x64.zip", "node-v18.19.1-win-x64", "ff08f8fe253fba9274992d7052e9d9a70141342d7b36ddbd6e84cbe823e312c6"),
    },
    node_version = "18.19.1",
)

load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

yarn_install(
    name = "npm",
    # We add the postinstall patches file here so that Yarn will rerun whenever
    # the file is modified.
    data = [
        "//:.yarn/releases/yarn-1.22.22.cjs",
        "//:.yarnrc",
        "//:tools/postinstall/apply-patches.js",
        "//:tools/postinstall/patches/@angular+bazel+16.0.0-next.6.patch",
    ],
    # Currently disabled due to:
    #  1. Missing Windows support currently.
    #  2. Incompatibilites with the `ts_library` rule.
    exports_directories_only = False,
    package_json = "//:package.json",
    quiet = False,
    # We prefer to symlink the `node_modules` to only maintain a single install.
    # See https://github.com/angular/dev-infra/pull/446#issuecomment-1059820287 for details.
    symlink_node_modules = True,
    yarn = "//:.yarn/releases/yarn-1.22.22.cjs",
    yarn_lock = "//:yarn.lock",
)

load("@npm//@bazel/protractor:package.bzl", "npm_bazel_protractor_dependencies")

npm_bazel_protractor_dependencies()

# Setup web testing. We need to setup a browser because the web testing rules for TypeScript need
# a reference to a registered browser (ideally that's a hermetic version of a browser)
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

# Setup the Sass rule repositories.
load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")

sass_repositories(
    yarn_script = "//:.yarn/releases/yarn-1.22.22.cjs",
)

# Setup repositories for browsers provided by the shared dev-infra package.
load(
    "@npm//@angular/build-tooling/bazel/browsers:browser_repositories.bzl",
    _dev_infra_browser_repositories = "browser_repositories",
)

_dev_infra_browser_repositories()

load("@build_bazel_rules_nodejs//toolchains/esbuild:esbuild_repositories.bzl", "esbuild_repositories")

esbuild_repositories(
    npm_repository = "npm",
)

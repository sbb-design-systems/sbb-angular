# Developer guide: getting your environment set up

1. Make sure you have both `node` and `yarn` installed.
   We recommend using `nvm` to manage your node versions.
2. sbb-angular uses Bazel which requires certain Bash and UNIX tools.
   - On Windows on SBB Managed Devices: Follow the guide to install on windows, but install MSYS2 to `C:\devsbb\msys64`
     and add `.bazelrc` to your user directory (`C:\Users\{user}\.bazelrc`) with the following content:
     ```
     startup --output_user_root=C:/devsbb/bazel/out
     build --repository_cache=C:/devsbb/bazel/cache
     ```
   - On Windows: Follow the [instructions](https://docs.bazel.build/versions/master/install-windows.html#step-5-optional-install-compilers-and-language-runtimes)
     to install [`MSYS2`](https://www.msys2.org/) and the listed "Common MSYS2 packages".
     Afterwards add `C:\msys64\usr\bin` to the `PATH` environment variable.
3. From the root of the project, run `yarn` to install the dependencies.

To build sbb-angular in release mode, run `yarn build`. The output can be found under `dist/releases`.

To bring up a local server, run `yarn start`. This will automatically watch for changes
and rebuild. The browser should refresh automatically when changes are made.

### Running tests

To run unit tests, run `yarn test <target>`. The `target` can be either a short name (e.g. `yarn test button`) or an explicit path `yarn test src/business/contextmenu`.
To run lint, run `yarn lint`.

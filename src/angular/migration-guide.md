# Migration Guide

This guide should help you migrate from `@sbb-esta/angular-public`, `@sbb-esta/angular-business`
and `@sbb-esta/angular-core` to `@sbb-esta/angular`.

`@sbb-esta/angular` now contains all modules in either `standard` (previously public),
`lean` (previously business) or in both variants. If a module is only available for either
`standard` or `lean`, but not both, it will have an notification at the top of the documentation.
The default variant is `standard`. To use the `lean` variant, add the `sbb-lean` CSS class to the
`html` element (e.g. `<html class="sbb-lean" ...>`).

Most of the breaking changes should automatically be migrated via `ng update`
(see our [How to update](howtoupdate) guide).

Please [reach out to us](https://github.com/sbb-design-systems/sbb-angular/issues/new/choose), if
one of these changes breaks your project in a non-recoverable way.

### Button

_Automatic migration available_

The button module has been refactored from the ground up. The `sbbButton` selector with the `mode`
input has been split into separate selectors.

| Previously                              | New                             |
| --------------------------------------- | ------------------------------- |
| `<button sbbButton>`                    | `<button sbb-button>`           |
| `<button sbbButton mode="primary">`     | `<button sbb-button>`           |
| `<button sbbButton mode="secondary">`   | `<button sbb-secondary-button>` |
| `<button sbbButton mode="ghost">`       | `<button sbb-ghost-button>`     |
| `<button sbbButton mode="frameless">`   | `<button sbb-frameless-button>` |
| `<button sbbButton mode="alternative">` | `<button sbb-alt-button>`       |
| `<button sbbButton mode="icon">`        | `<button sbb-icon-button>`      |

Support for custom icon has been changed. Previously the `*sbbIcon` directive could be used,
which is no longer supported. The button component now provides an `indicatorIcon` input, for which
[any supported](angular/icon-overview) (or self registered) icon can be used.

[Documentation](angular/button)

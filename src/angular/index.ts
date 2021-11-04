// primary entry-point which is empty as of version 13. All components should
// be imported through their individual entry-points. This file is needed to
// satisfy the "ng_package" bazel rule which also requires a primary entry-point.

// Workaround for: https://github.com/microsoft/rushstack/issues/2806.
// This is a private export that can be removed at any time.
export const ɵɵtsModuleIndicatorApiExtractorWorkaround = true;

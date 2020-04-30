This module contains the `Breakpoints` constant, which can be used with the
[BreakpointObserver](https://material.angular.io/cdk/layout/overview#breakpointobserver).

Currently the following breakpoints exist:

```ts
export const Breakpoints = {
  Mobile: '(max-width: 420.99px)',
  Tablet: '(min-width: 421px) and (max-width: 1024.99px)',
  DesktopAndAbove: '(min-width: 1025px)',
  Desktop: '(min-width: 1025px) and (max-width: 1440.99px)',
  DesktopLargePlus: '(min-width: 1441px) and (max-width: 2560.99px)',
  Desktop4k: '(min-width: 2561px) and (max-width: 3840.99px)',
  Desktop5k: '(min-width: 3841px)'
};
```

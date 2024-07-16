export const Breakpoints = {
  Mobile: '(max-width: 642.99px)',
  Tablet: '(min-width: 643px) and (max-width: 1024.99px)',
  Desktop: '(min-width: 1025px) and (max-width: 1280.99px)',
  DesktopLarge: '(min-width: 1281px) and (max-width: 1440.99px)',
  Desktop2k: '(min-width: 1441px) and (max-width: 2560.99px)',
  Desktop4k: '(min-width: 2561px) and (max-width: 3840.99px)',
  Desktop5k: '(min-width: 3841px)',

  MobileDevice:
    '(max-width: 642.99px) and (orientation: portrait), ' +
    '(max-width: 1024.99px) and (orientation: landscape)',
  TabletDevice:
    '(min-width: 643px) and (max-width: 897.99px) and (orientation: portrait), ' +
    '(min-width: 1025px) and (max-width: 1280.99px) and (orientation: landscape)',
  DesktopDevice:
    '(min-width: 898px) and (orientation: portrait), ' +
    '(min-width: 1280px) and (orientation: landscape)',

  MobileDevicePortrait: '(max-width: 642.99px) and (orientation: portrait)',
  TabletDevicePortrait: '(min-width: 643px) and (max-width: 897.99px) and (orientation: portrait)',
  DesktopDevicePortrait: '(min-width: 898px) and (orientation: portrait)',

  MobileDeviceLandscape: '(max-width: 1024.99px) and (orientation: landscape)',
  TabletDeviceLandscape:
    '(min-width: 1025px) and (max-width: 1279.99px) and (orientation: landscape)',
  DesktopDeviceLandscape: '(min-width: 1280px) and (orientation: landscape)',
};

export const SCALING_FACTOR_4K = 1.5;

export const SCALING_FACTOR_5K = 2;

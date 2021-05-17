// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

export class SbbMarkerColors {
  public static lilaColor: number[] = [178, 102, 234];
  public static transparentLilaColor: number[] = [178, 102, 234, 0.4];
}

export class SbbMarkerSizes {
  static standardSize = '25px';
  static standardOutlineWidth = 2;
}

export class SbbMarkerSymbolSettings {
  static simpleSymbol = {
    style: 'circle',
    color: SbbMarkerColors.transparentLilaColor,
    size: SbbMarkerSizes.standardSize,
    outline: {
      color: SbbMarkerColors.lilaColor,
      width: SbbMarkerSizes.standardOutlineWidth,
    },
  } as __esri.SimpleMarkerSymbolProperties;
}

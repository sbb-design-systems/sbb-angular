// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

export class MarkerColors {
  public static lilaColor = [178, 102, 234];
  public static transparentLilaColor = [178, 102, 234, 0.4];
}

export class MarkerSizes {
  static standardSize = '25px';
  static standardOutlineWidth = 2;
}

export class MarkerSymbolSettings {
  static simpleSymbol = {
    style: 'circle',
    color: MarkerColors.transparentLilaColor,
    size: MarkerSizes.standardSize,
    outline: {
      color: MarkerColors.lilaColor,
      width: MarkerSizes.standardOutlineWidth
    }
  } as __esri.SimpleMarkerSymbolProperties;
}

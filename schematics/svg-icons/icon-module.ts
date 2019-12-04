export class IconModule {
  constructor(
    readonly normalizedName: string,
    readonly collections: string[],
    readonly svgContent: string,
    readonly width: string,
    readonly height: string
  ) {}
}

export class UiIcon {
  public label: string;
  constructor(
    public name: string,
    public selector: string,
    public tags: string[],
  ) {
    this.label = name;
  }
}

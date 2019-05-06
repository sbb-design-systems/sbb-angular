export class UiIcon {
  public label: string;
  constructor(
    public name: string,
    public selector: string,
    public modules: string[]
  ) {
    this.label = name;
  }
}

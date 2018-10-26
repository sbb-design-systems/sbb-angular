
export class ShowcaseOption {

  constructor(
    private label: string,
    private value: string
  ) { }

  getLabel(): string {
    return this.label;
  }

  getValue() {
    return this.value;
  }

}

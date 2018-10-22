import { Option } from 'sbb-angular';

export class ShowcaseOption implements Option {

  constructor(
    private label: string,
    private value: string
  ) {}

  getLabel(): string {
    return this.label;
  }

  getValue() {
    return this.value;
  }

}

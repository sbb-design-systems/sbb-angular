import { IconModule } from './icon-module';

export class IconModuleCollection {
  readonly icons: IconModule[] = [];
  readonly collections = new Map<string, IconModuleCollection>();

  constructor(readonly normalizedName?: string) {}

  getCollection(normalizedName: string) {
    const existingCollection = this.collections.get(normalizedName);
    if (existingCollection) {
      return existingCollection;
    }

    const collection = new IconModuleCollection(normalizedName);
    this.collections.set(normalizedName, collection);
    return collection;
  }

  addIcon(iconModule: IconModule) {
    this.icons.push(iconModule);
  }

  addAll(iconModules: IconModule[]) {
    iconModules.forEach(i =>
      i.collections.reduce((current, next) => current.getCollection(next), this).addIcon(i)
    );
    return this;
  }
}

import { Injectable } from '@angular/core';
import { iconComponentsMetaInformation } from 'sbb-angular-icons';
import { UiIcon } from '../shared/ui-icon';
import { UiComponent } from '../shared/ui-component';

@Injectable({
  providedIn: 'root'
})
export class IconUiService {

  getUiIconByRouterLink(name: any): UiIcon {
    return iconComponentsMetaInformation
      .map(item => new UiIcon(item.name, item.selector, item.modules))
      .find((uiIcon) => uiIcon.name.localeCompare(name, 'en', { sensitivity: 'base' }) === 0);
  }

  getUiComponentByRouterLink(name: any): UiComponent {
    const foundUiIcon: UiIcon = iconComponentsMetaInformation
      .map(item => new UiIcon(item.name, item.selector, item.modules))
      .find(uiIcon => uiIcon.name.localeCompare(name, 'en', { sensitivity: 'base' }) === 0);
    return new UiComponent(foundUiIcon.name,
      foundUiIcon.name,
      foundUiIcon.name,
      'Subtitel goes here ...',
      true,
      false,
      ['Davide Aresta', 'Stefan Meili'],
      'Description goes here ...',
      'Source goes here ...',
      'Import text.');
  }

  getUiIconsBySearchValue(searchValue: any) {

    if (searchValue.length > 0) {
      return iconComponentsMetaInformation
        .filter(uiIcon =>
          (new RegExp(searchValue, 'ig').test(uiIcon.name)) ||
          (new RegExp(searchValue, 'ig').test(uiIcon.selector)) ||
          uiIcon.modules.find(tag => (new RegExp(searchValue, 'ig').test(tag))))
        .map(item => new UiIcon(item.name, item.selector, item.modules))
        .map(uiIcon => {
          if (new RegExp(searchValue, 'ig').test(uiIcon.name)) {
            uiIcon.label = uiIcon.label.replace(new RegExp(searchValue, 'ig'), m => `<b>${m}</b>`);
          }
          return uiIcon;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return this.getAll();
  }

  getAll(): Array<UiIcon> {
    return iconComponentsMetaInformation
      .map(item => new UiIcon(item.name, item.selector, item.modules))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

import { Injectable } from '@angular/core';
import { ICON_COMPONENT_META_INFORMATION } from '@sbb-esta/angular-icons';

import { UiComponent } from '../shared/ui-component';
import { UiIcon } from '../shared/ui-icon';

@Injectable({
  providedIn: 'root'
})
export class IconUiService {
  getUiIconByRouterLink(name: any): UiIcon {
    return ICON_COMPONENT_META_INFORMATION.map(
      item => new UiIcon(item.name, item.selector, item.modules)
    ).find(
      uiIcon =>
        uiIcon.name.localeCompare(name, 'en', { sensitivity: 'base' }) === 0
    );
  }

  getUiComponentByRouterLink(name: any): UiComponent {
    const foundUiIcon: UiIcon = ICON_COMPONENT_META_INFORMATION.map(
      item => new UiIcon(item.name, item.selector, item.modules)
    ).find(
      uiIcon =>
        uiIcon.name.localeCompare(name, 'en', { sensitivity: 'base' }) === 0
    );
    return new UiComponent(
      foundUiIcon.name,
      foundUiIcon.name,
      foundUiIcon.name,
      'Subtitel goes here ...',
      true,
      false,
      ['Davide Aresta', 'Stefan Meili'],
      'Description goes here ...',
      'Source goes here ...',
      'Import text.'
    );
  }

  getUiIconsBySearchValue(searchValue: any) {
    if (!searchValue) {
      return this.getAll();
    }

    const searchRegex = new RegExp(searchValue, 'ig');
    return ICON_COMPONENT_META_INFORMATION.filter(
      icon =>
        searchRegex.test(icon.name) ||
        searchRegex.test(icon.selector) ||
        icon.modules.find(tag => searchRegex.test(tag))
    )
      .sort((a, b) => a.name.localeCompare(b.name))
      .concat(
        ICON_COMPONENT_META_INFORMATION.filter(icon =>
          icon.meta.some(m => searchRegex.test(m))
        )
      )
      .map(icon => new UiIcon(icon.name, icon.selector, icon.modules))
      .map(icon => {
        if (searchRegex.test(icon.name)) {
          icon.label = icon.label.replace(searchRegex, m => `<b>${m}</b>`);
        }
        return icon;
      });
  }

  getAll(): Array<UiIcon> {
    return ICON_COMPONENT_META_INFORMATION.map(
      item => new UiIcon(item.name, item.selector, item.modules)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }
}

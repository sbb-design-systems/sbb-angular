import { Injectable } from '@angular/core';
import { SBBComponentsMapping } from '../shared/sbb-components-mapping';
import { UiIcon } from '../shared/ui-icon';
import { UiComponent } from '../shared/ui-component';

@Injectable({
  providedIn: 'root'
})
export class IconUiService {

  constructor() {
  }

  getUiIconByRouterLink(name: any) : UiIcon {
    let foundUiIcons : UiIcon[] = [];
    foundUiIcons = SBBComponentsMapping.icons.filter(uiIcon => uiIcon.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
    return foundUiIcons[0];
  }

  getUiComponentByRouterLink(name: any) : UiComponent {
    let foundUiIcons : UiIcon[] = [];
    foundUiIcons = SBBComponentsMapping.icons.filter(uiIcon => uiIcon.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
    return new UiComponent(foundUiIcons[0]['name'],foundUiIcons[0]['name'],foundUiIcons[0]['name'],'Subtitel goes here ...',true,false,['Davide Aresta', 'Stefan Meili'],'Description goes here ...',foundUiIcons[0]['selector'],'Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.');
  }

  getUiIconsBySearchValue(searchValue : any) {

    let foundUiIcons : UiIcon[] = [];
    if(searchValue.length > 0) {
       foundUiIcons = SBBComponentsMapping.icons.filter(
         uiIcon => uiIcon.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                   uiIcon.selector.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                   uiIcon.tags.find(tag => tag.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
       );
    }

    const newFoundUIIcons : UiIcon[] = [];
    foundUiIcons.forEach(function(item) {
      newFoundUIIcons.push(new UiIcon(item.name, item.selector, item.tags));
    });

    for(const uiIcon of newFoundUIIcons) {
        if(uiIcon.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
           const index = uiIcon.name.toLowerCase().indexOf(searchValue.toLowerCase());
           const preFix = uiIcon.name.substring(0, index);
           const sufFix = uiIcon.name.substring(index + searchValue.length);
           const searchText = uiIcon.name.substring(index, index + searchValue.length);
           const newName = preFix + '<b>' + searchText + '</b>' + sufFix;
           uiIcon.name = newName;
        }
    }

    return newFoundUIIcons.sort((a,b) => a.name.localeCompare(b.name));
  }

  getAll() : Array<UiIcon> {
    return  SBBComponentsMapping.icons.sort((a,b) => a.name.localeCompare(b.name));
  }
}

import { Injectable } from '@angular/core';
import { UiComponent } from '../shared/ui-component';
import { TextareaShowcaseComponent } from '../examples/textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from '../examples/links-showcase/links-showcase.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentUiService {

  uiComponents: UiComponent[];

  constructor() {
    this.uiComponents = [
      // tslint:disable-next-line
      new UiComponent('Button','button','Button','Button is an extension to standard input element with icons and theming.',true,false,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('List','list','List','Listbox is used to select one or more values from a list of items.',true,false,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Table','table','Table','Table is the successor of p-dataTable with a lightning fast performance (at least 10x faster) and excellent level of control over the presentation. p-table is called as TurboTable in order to differantiate if from the deprecated p-dataTable.',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Link','link','Link','Subtitel goes here ...',true,false,['Davide Aresta', 'Stefan Meili, Dario D\'Oronzo'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.', LinksShowcaseComponent),
      // tslint:disable-next-line
      new UiComponent('Loading Indicator','loadingIndicator','Loading Indicator','Subtitel goes here ...',true,false,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Input Field','inputField','Input Field','Input Field is an extension to standard input element with theming.',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Autocompletion','autocompletion','Autocompletion','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Text Area','textArea','Text Area','Subtitel goes here ...',true,false,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.', TextareaShowcaseComponent),
      // tslint:disable-next-line
      new UiComponent('Select','select','Select','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Date Picker','datePicker','Date Picker','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Time Chooser','timeChooser','Time Chooser','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Radio Button','radioButton','Radio Button','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Check Box','checkBox','Check Box','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Tab','tab','Tab','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Accordion','accordion','Accordion','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Section (Fieldset)','section','Section (Fieldset)','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Light Box','lightBox','Light Box','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Notification','notification','Notification','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Process Flow','processFlow','Process Flow','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Option Chooser (simple)','optionChooserSimple','Option Chooser (simple)','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.'),
      // tslint:disable-next-line
      new UiComponent('Option Chooser (multiple)','optionChooserMultiple','Option Chooser (multiple)','Subtitel goes here ...',true,true,['Davide Aresta', 'Stefan Meili'],'Description goes here ...','Source goes here ...','Import text.','Getting started text.','Model binding text.','Icon text.','Auto resize text.','Properties text.','Events text.','Styling text.','Dependencies text.')
    ];
  }

  getUiComponentByRouterLink(name: any) : UiComponent {
    return this.uiComponents.find(uiComponent => uiComponent.routerLink === name);
  }

  getUiComponentsBySearchValue(searchValue : any) : Array<UiComponent> {

    let foundUiComponents : UiComponent[] = [];
    if(searchValue.length > 0) {
       foundUiComponents = this.uiComponents.filter(
         uiComponent => uiComponent.routerLink.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
       );
    }

    const newFoundUiComponents: UiComponent[] = [];
    foundUiComponents.forEach(function(item) {
      // tslint:disable-next-line
      newFoundUiComponents.push(new UiComponent(item.id,item.routerLink,item.title,item.subTitle,item.isComponent,item.isDirective,item.authors,item.description,item.source,item.importText,item.gettingStartedText,item.modelBindingText,item.iconsText,item.autoResizeText,item.propertiesText,item.eventsText,item.stylingText,item.dependenciesText));
    });

    for(const uiComponent of newFoundUiComponents) {
        if(uiComponent.id.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
           const index = uiComponent.id.toLowerCase().indexOf(searchValue.toLowerCase());
           const preFix = uiComponent.id.substring(0, index);
           const sufFix = uiComponent.id.substring(index + searchValue.length);
           const searchText = uiComponent.id.substring(index, index + searchValue.length);
           const newId = preFix + '<b>' + searchText + '</b>' + sufFix;
           uiComponent.id = newId;
        }
    }

    return newFoundUiComponents.sort((a,b) => a.id.localeCompare(b.id));
  }

  getAll() : Array<UiComponent> {
    return this.uiComponents.sort((a,b) => a.id.localeCompare(b.id));
  }

  getAllAsString() : Array<string> {
    const routerLinks : string[] = [];
    for(const uiComponent of this.uiComponents) {
        routerLinks.push(uiComponent['routerLink']);
    }
    return routerLinks;
  }
}

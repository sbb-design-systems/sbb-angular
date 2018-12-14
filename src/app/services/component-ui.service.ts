import { Injectable } from '@angular/core';
import { UiComponent } from '../shared/ui-component';
import { TextareaShowcaseComponent } from '../examples/textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from '../examples/links-showcase/links-showcase.component';
import { AutocompleteShowcaseComponent } from '../examples/autocomplete-showcase/autocomplete-showcase.component';
import { ButtonShowcaseComponent } from '../examples/button-showcase/button-showcase.component';
import { RadioButtonShowcaseComponent } from '../examples/radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from '../examples/checkbox-showcase/checkbox-showcase.component';
import { TimeInputShowcaseComponent } from '../examples/time-input-showcase/time-input-showcase.component';
import { DatepickerShowcaseComponent } from '../examples/datepicker-showcase/datepicker-showcase.component';
import { FieldShowcaseComponent } from '../examples/field-showcase/field-showcase.component';
import { TabsShowcaseComponent } from '../examples/tabs-showcase/tabs-showcase.component';
import { LoadingShowcaseComponent } from '../examples/loading-showcase/loading-showcase.component';
import { LightboxShowcaseComponent } from '../examples/lightbox-showcase/lightbox-showcase.component';
import { SelectShowcaseComponent } from '../examples/select-showcase/select-showcase.component';
import { AccordionShowcaseComponent } from '../examples/accordion-showcase/accordion-showcase.component';


@Injectable({
  providedIn: 'root'
})
export class ComponentUiService {

  uiComponents: UiComponent[];

  constructor() {
    this.uiComponents = [
      new UiComponent(
        'Button',
        'button',
        'Button',
        'Button is an extension to standard input element with icons and theming.',
        true,
        false,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        ButtonShowcaseComponent
      ),
      /* new UiComponent(
        'List',
        'list',
        'List',
        'Listbox is used to select one or more values from a list of items.',
        true,
        false,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.'
      ), */
      /* new UiComponent(
        'Table',
        'table',
        'Table',
        'Table is the successor of p-dataTable with a lightning fast performance (at least 10x faster) ' +
        'and excellent level of control over the presentation. p-table is called as TurboTable in order to ' +
        'differantiate if from the deprecated p-dataTable.',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.'
      ), */
      new UiComponent(
        'Link',
        'links',
        'Link',
        null,
        true,
        false,
        ['Davide Aresta', 'Stefan Meili, Dario D\'Oronzo'],
        null,
        '<a href="#" sbbLink mode="normal" icon="arrow">Bezeichnung</a>\n<a href="#" sbbSocialLink icon="facebook">Bezeichnung</a>',
        'import { LinksModule } from \'sbb-angular\';\n\n' +
        '@NgModule({\n  declarations: [\n    ...\n  ],\n  imports: [\n    ...\n    LinksModule\n  ]\n})\n' +
        'export class ExamplesModule { }',
        LinksShowcaseComponent
      ),
      new UiComponent(
        'Loading Indicator',
        'loading',
        'Loading Indicator',
        'Subtitel goes here ...',
        true,
        false,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        LoadingShowcaseComponent
      ),
      new UiComponent(
        'Field',
        'field',
        'Field',
        'Describes an input field that can contain different values: text, password, number etc',
        true,
        false,
        ['Davide Genchi'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        FieldShowcaseComponent
      ),
      new UiComponent(
        'Autocompletion',
        'autocomplete',
        'Autocompletion',
        'Subtitel goes here ...',
        true,
        false,
        ['Davide Aresta', 'Stefan Meili', 'Dario D\'Oronzo'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        AutocompleteShowcaseComponent
      ),
      new UiComponent(
        'Text Area',
        'textarea',
        'Text Area',
        'Subtitel goes here ...',
        true,
        false,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        TextareaShowcaseComponent
      ),
      new UiComponent(
        'Select',
        'select',
        'Select',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        SelectShowcaseComponent
      ),
      new UiComponent(
        'Date Picker',
        'datepicker',
        'Date Picker',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        DatepickerShowcaseComponent
      ), /*
      new UiComponent(
        'Time Chooser',
        'timeChooser',
        'Time Chooser',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.'

      ),
        'Import text.'
      ), */
      new UiComponent(
        'Radio Button',
        'radio-button',
        'Radio Button',
        null,
        true,
        false,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        RadioButtonShowcaseComponent
      ),
      new UiComponent(
        'Check Box',
        'checkbox',
        'Check Box',
        'Subtitel goes here ...',
        true,
        false,
        ['Davide Aresta', 'Stefan Meili', 'Dario D\'Oronzo'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        CheckboxShowcaseComponent
      ),
      new UiComponent(
        'Tab',
        'tabs',
        'Tab',
        'Subtitel goes here ...',
        true,
        false,
        ['Davide Aresta', 'Marco Sut', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        TabsShowcaseComponent
      ),
     new UiComponent(
        'Accordion',
        'accordion',
        'Accordion',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        AccordionShowcaseComponent
      ),
      /* new UiComponent(
        'Section (Fieldset)',
        'section',
        'Section (Fieldset)',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.'
      ), */
      new UiComponent(
        'Light Box',
        'lightBox',
        'Light Box',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        LightboxShowcaseComponent
      ),
      /*  new UiComponent(
         'Notification',
         'notification',
         'Notification',
         'Subtitel goes here ...',
         true,
         true,
         ['Davide Aresta', 'Stefan Meili'],
         'Description goes here ...',
         'Source goes here ...',
         'Import text.'
       ), */
      /* new UiComponent(
        'Process Flow',
        'processFlow',
        'Process Flow',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.'
      ), */
      /* new UiComponent(
        'Option Chooser (simple)',
        'optionChooserSimple',
        'Option Chooser (simple)',
        'Subtitel goes here ...',
        true,
        true,
        ['Davide Aresta', 'Stefan Meili'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.'
      ), */
      new UiComponent(
        'Time Input',
        'time-input',
        'Time Input',
        'Subtitel goes here ...',
        true,
        false,
        ['Davide Aresta', 'Stefan Meili', 'Dario D\'Oronzo'],
        'Description goes here ...',
        'Source goes here ...',
        'Import text.',
        TimeInputShowcaseComponent
      )
    ];
  }

  getUiComponentByRouterLink(name: any): UiComponent {
    return this.uiComponents.find(uiComponent => uiComponent.routerLink === name);
  }

  getUiComponentsBySearchValue(searchValue: any): Array<UiComponent> {

    let foundUiComponents: UiComponent[] = [];
    if (searchValue.length > 0) {
      foundUiComponents = this.uiComponents.filter(
        uiComponent => uiComponent.routerLink.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      );
    } else {
      foundUiComponents = this.uiComponents;
    }

    const newFoundUiComponents: UiComponent[] = [];
    foundUiComponents.forEach(function (item) {
      newFoundUiComponents.push(
        new UiComponent(
          item.id,
          item.routerLink,
          item.title,
          item.subTitle,
          item.isComponent,
          item.isDirective,
          item.authors,
          item.description,
          item.source,
          item.importText
        )
      );
    });

    for (const uiComponent of newFoundUiComponents) {
      if (uiComponent.id.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
        const index = uiComponent.id.toLowerCase().indexOf(searchValue.toLowerCase());
        const preFix = uiComponent.id.substring(0, index);
        const sufFix = uiComponent.id.substring(index + searchValue.length);
        const searchText = uiComponent.id.substring(index, index + searchValue.length);
        const newId = preFix + '<b>' + searchText + '</b>' + sufFix;
        uiComponent.id = newId;
      }
    }

    return newFoundUiComponents.sort((a, b) => a.id.localeCompare(b.id));
  }

  getAll(): Array<UiComponent> {
    return this.uiComponents.sort((a, b) => a.id.localeCompare(b.id));
  }

  getAllAsString(): Array<string> {
    const routerLinks: string[] = [];
    for (const uiComponent of this.uiComponents) {
      routerLinks.push(uiComponent['routerLink']);
    }
    return routerLinks;
  }
}

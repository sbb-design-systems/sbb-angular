import { DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, DebugElement, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import {
  clearElement,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  typeInElement,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbInput, SbbInputModule } from '@sbb-esta/angular/input';

import { SbbHeaderSearch } from './header-search';
import { SbbSearch, SbbSearchModule } from './index';

@Component({
  selector: 'sbb-simple-search-component',
  template: `
    <sbb-search (search)="handleSearch($event)">
      <input sbbInput placeholder="Search" />
    </sbb-search>
  `,
  standalone: true,
  imports: [SbbInputModule, SbbSearchModule],
})
export class SimpleSearchComponent {
  searchResults: string[] = [];
  @ViewChild(SbbSearch, { static: true }) search: SbbSearch;
  @ViewChild(SbbInput, { static: true }) input: SbbInput;

  handleSearch(event: string) {
    this.searchResults.push(event);
  }
}

@Component({
  selector: 'sbb-simple-search-autocomplete-component',
  template: `
    <sbb-search (search)="handleSearch($event)">
      <input sbbInput placeholder="Search" [sbbAutocomplete]="auto1" />
    </sbb-search>
    <sbb-autocomplete #auto1="sbbAutocomplete">
      @for (option of filteredOptions; track option) {
        <sbb-option [value]="option">
          {{ option }}
        </sbb-option>
      }
    </sbb-autocomplete>
  `,
  standalone: true,
  imports: [SbbAutocompleteModule, SbbInputModule, SbbSearchModule],
})
export class SimpleSearchAutocompleteComponent {
  lastSearch = '';
  @ViewChild(SbbSearch, { static: true }) search: SbbSearch;

  options: string[] = [
    'Eins',
    'Zwei',
    'Drei',
    'Vier',
    'Fünf',
    'Sechs',
    'Sieben',
    'Acht',
    'Neun',
    'Zehn',
  ];
  filteredOptions = this.options.slice(0);

  handleSearch($event: any) {
    this.lastSearch = $event;
  }
}

@Component({
  selector: 'sbb-simple-search-header-component',
  template: `
    <button [label]="label" type="button" sbbHeaderSearch>
      <sbb-search (search)="handleSearch()">
        <input sbbInput placeholder="Search" />
      </sbb-search>
    </button>
  `,
  standalone: true,
  imports: [SbbInputModule, SbbSearchModule],
})
export class SimpleSearchHeaderComponent {
  label = 'Suche';
  searchCounter = 0;
  @ViewChild(SbbHeaderSearch, { static: true }) searchComponent: SbbHeaderSearch;

  handleSearch() {
    this.searchCounter++;
  }
}

@Component({
  selector: 'sbb-simple-search-autocomplete-header-component',
  template: `
    <button type="button" sbbHeaderSearch>
      <sbb-search (search)="handleSearch($event)">
        <input sbbInput placeholder="Search" [sbbAutocomplete]="auto1" />
      </sbb-search>
    </button>
    <sbb-autocomplete #auto1="sbbAutocomplete">
      @for (option of filteredOptions; track option) {
        <sbb-option [value]="option">
          {{ option }}
        </sbb-option>
      }
    </sbb-autocomplete>
  `,
  standalone: true,
  imports: [SbbInputModule, SbbAutocompleteModule, SbbSearchModule],
})
export class SimpleSearchAutocompleteHeaderComponent {
  lastSearch = '';
  @ViewChild(SbbHeaderSearch, { static: true }) searchComponent: SbbHeaderSearch;

  options: string[] = [
    'Eins',
    'Zwei',
    'Drei',
    'Vier',
    'Fünf',
    'Sechs',
    'Sieben',
    'Acht',
    'Neun',
    'Zehn',
  ];
  filteredOptions = this.options.slice(0);

  handleSearch($event: any) {
    this.lastSearch = $event;
  }
}

describe('SbbSearch', () => {
  describe('without autocomplete', () => {
    let component: SimpleSearchComponent;
    let fixture: ComponentFixture<SimpleSearchComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          SbbIconTestingModule,
          SbbInputModule,
          SbbSearchModule,
          SimpleSearchComponent,
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleSearchComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show a placeholder', () => {
      expect(component.input.placeholder).toBe('Search');
    });

    describe('when pressing the ENTER key', () => {
      it('should emit a search event', () => {
        expect(component.searchResults.length).toBe(0);
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER);
        fixture.detectChanges();
        expect(component.searchResults.length).toBe(1);
      });

      it('should emit a search event with the search value', () => {
        const expectedValue = 'value';
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        typeInElement(input.nativeElement, expectedValue);
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER);
        fixture.detectChanges();
        expect(component.searchResults).toEqual([expectedValue]);
        clearElement(input.nativeElement);
        const expectedValue2 = 'value2';
        typeInElement(input.nativeElement, expectedValue2);
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER);
        fixture.detectChanges();
        expect(component.searchResults).toEqual([expectedValue, expectedValue2]);
      });
    });

    describe('when clicking on the search button', () => {
      it('should emit a search event', () => {
        expect(component.searchResults.length).toBe(0);
        const searchButton = fixture.debugElement.query(By.css('.sbb-search > button'));
        searchButton.nativeElement.click();
        expect(component.searchResults.length).toBe(1);
      });
    });
  });

  describe('with autocomplete', () => {
    let component: SimpleSearchAutocompleteComponent;
    let fixture: ComponentFixture<SimpleSearchAutocompleteComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, SbbIconTestingModule, SimpleSearchAutocompleteComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleSearchAutocompleteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    describe('when focusing input', () => {
      it('should open the options panel', () => {
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(false);
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(true);
      });
    });

    describe('when clicking on an option', () => {
      it('should emit a search event with the selected value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('sbb-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.lastSearch).toBe('Eins');
      });

      it('should close the autocomplete panel', () => {
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(false);
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(true);
        const options = fixture.debugElement.queryAll(By.css('sbb-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(false);
      });

      it('should have selected value as input value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('sbb-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();
        expect(input.nativeElement.value).toBe('Eins');
      });
    });

    describe('when selecting an option with ENTER key', () => {
      it('should emit a search event with the selected value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        dispatchKeyboardEvent(input.nativeElement, 'keydown', DOWN_ARROW);
        fixture.detectChanges();
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER);
        fixture.detectChanges();
        expect(component.lastSearch).toBe('Eins');
      });

      it('should close the autocomplete panel', () => {
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(false);
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        dispatchKeyboardEvent(input.nativeElement, 'keydown', DOWN_ARROW);
        fixture.detectChanges();
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER);
        fixture.detectChanges();
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(false);
      });

      it('should have selected value as input value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        dispatchKeyboardEvent(input.nativeElement, 'keydown', DOWN_ARROW);
        fixture.detectChanges();
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER);
        fixture.detectChanges();
        expect(input.nativeElement.value).toBe('Eins');
      });
    });

    describe('when starting to search', () => {
      function openAutocompletePanel(input: DebugElement) {
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(true);
      }

      it('should close autocomplete panel when pressing search button', () => {
        // open panel
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        openAutocompletePanel(input);

        // press search button
        const searchButton = fixture.debugElement.query(By.css('.sbb-search > button'));
        searchButton.nativeElement.click();
        fixture.detectChanges();

        // expect panel to be closed
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(false);
      });

      it('should close autocomplete panel by keyboard', () => {
        // open panel
        const input = fixture.debugElement.query(By.css('.sbb-search > input'));
        openAutocompletePanel(input);

        // hit enter on input field
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER, 'Enter');
        fixture.detectChanges();

        // expect panel to be closed
        expect(component.search._autocompleteTrigger!.autocomplete.isOpen).toBe(false);
      });
    });
  });

  describe('header mode', () => {
    describe('without autocomplete', () => {
      let component: SimpleSearchHeaderComponent;
      let fixture: ComponentFixture<SimpleSearchHeaderComponent>;
      let overlayContainerElement: HTMLElement;

      beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [NoopAnimationsModule, SbbIconTestingModule, SimpleSearchHeaderComponent],
        }).compileComponents();

        inject([OverlayContainer], (oc: OverlayContainer) => {
          overlayContainerElement = oc.getContainerElement();
        })();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleSearchHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      describe('when clicking on the trigger', () => {
        it('should show the search box', () => {
          const searchButton = fixture.debugElement.query(By.css('.sbb-header-search'));
          searchButton.nativeElement.click();
          fixture.detectChanges();
          const searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).not.toBeNull();
          expect(searchOverlay?.id).toEqual(component.searchComponent.panelId);
        });

        it('should have focus on the input element', async () => {
          const searchButton = fixture.debugElement.query(By.css('.sbb-header-search'));
          searchButton.nativeElement.click();
          fixture.detectChanges();
          await fixture.whenStable();
          const overlayInput = overlayContainerElement.querySelector('input.sbb-input-element');
          expect(document.activeElement).toBe(overlayInput);
        });
      });

      describe('when interacting with it programmatically', () => {
        it('should be opened when calling open()', () => {
          let searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).toBeNull();
          component.searchComponent.open();
          fixture.detectChanges();
          searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).not.toBeNull();
        });

        it('should be closed when calling close()', fakeAsync(() => {
          component.searchComponent.open();
          fixture.detectChanges();
          let searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).not.toBeNull();

          component.searchComponent.close();
          fixture.detectChanges();
          flush();
          searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).toBeNull();
        }));

        it('should toggle', fakeAsync(() => {
          component.searchComponent.toggle();
          fixture.detectChanges();
          let searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).not.toBeNull();

          component.searchComponent.toggle();
          fixture.detectChanges();
          flush();
          searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).toBeNull();
        }));
      });
    });

    describe('with autocomplete', () => {
      let component: SimpleSearchAutocompleteHeaderComponent;
      let fixture: ComponentFixture<SimpleSearchAutocompleteHeaderComponent>;
      let overlayContainerElement: HTMLElement;

      beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            NoopAnimationsModule,
            SbbIconTestingModule,
            SimpleSearchAutocompleteHeaderComponent,
          ],
        }).compileComponents();

        inject([OverlayContainer], (oc: OverlayContainer) => {
          overlayContainerElement = oc.getContainerElement();
        })();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleSearchAutocompleteHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      describe('when clicking on the trigger', () => {
        it('should show the search box', () => {
          const searchButton = fixture.debugElement.query(By.css('.sbb-header-search'));
          searchButton.nativeElement.click();
          fixture.detectChanges();
          const searchOverlay = overlayContainerElement.querySelector('.sbb-header-search-overlay');
          expect(searchOverlay).not.toBeNull();
          expect(searchOverlay?.id).toEqual(component.searchComponent.panelId);
        });

        it('should show the autocomplete', fakeAsync(async () => {
          const searchButton = fixture.debugElement.query(By.css('.sbb-header-search'));
          searchButton.nativeElement.click();
          fixture.detectChanges();
          await fixture.whenStable();
          flush();
          expect(component.searchComponent._search._autocompleteTrigger!.panelOpen).toBeTrue();
        }));

        it('should have the same width for the overlay and the autocomplete', fakeAsync(async () => {
          const searchButton = fixture.debugElement.query(By.css('.sbb-header-search'));
          searchButton.nativeElement.click();
          fixture.detectChanges();
          flush();
          await fixture.whenStable();
          const searchOverlay = overlayContainerElement.querySelector(
            '.sbb-header-search-overlay',
          )!;
          const autocompleteOverlay =
            overlayContainerElement.querySelector('.sbb-autocomplete-panel')!;
          expect(searchOverlay.getBoundingClientRect().width).toEqual(
            autocompleteOverlay.getBoundingClientRect().width,
          );
        }));
      });
    });
  });
});

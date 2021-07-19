import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import { dispatchFakeEvent, dispatchKeyboardEvent } from '@sbb-esta/angular-core/testing';
import { createKeyboardEvent } from '@sbb-esta/angular-core/testing';
import { SbbAutocompleteModule } from '@sbb-esta/angular-public/autocomplete';

import { SbbSearch } from '../public-api';
import { SbbSearchModule } from '../search.module';

@Component({
  selector: 'sbb-simple-search-component',
  template: ` <sbb-search (search)="search()" placeholder="Search"> </sbb-search> `,
})
export class SimpleSearchComponent {
  searchCounter = 0;
  @ViewChild(SbbSearch, { static: true }) searchComponent: SbbSearch;

  search() {
    this.searchCounter++;
  }
}

@Component({
  selector: 'sbb-simple-search-autocomplete-component',
  template: `
    <sbb-search (search)="search($event)" placeholder="Search" [sbbAutocomplete]="auto1">
    </sbb-search>
    <sbb-autocomplete #auto1="sbbAutocomplete">
      <sbb-option *ngFor="let option of filteredOptions" [value]="option">
        {{ option }}
      </sbb-option>
    </sbb-autocomplete>
  `,
})
export class SimpleSearchAutocompleteComponent {
  lastSearch = '';
  @ViewChild(SbbSearch, { static: true }) searchComponent: SbbSearch;

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

  search($event: any) {
    this.lastSearch = $event;
  }
}

@Component({
  selector: 'sbb-simple-search-header-component',
  template: ` <sbb-search mode="header" (search)="search()" placeholder="Search"> </sbb-search> `,
})
export class SimpleSearchHeaderComponent {
  searchCounter = 0;
  @ViewChild(SbbSearch, { static: true }) searchComponent: SbbSearch;

  search() {
    this.searchCounter++;
  }
}

@Component({
  selector: 'sbb-simple-search-autocomplete-header-component',
  template: `
    <sbb-search
      mode="header"
      (search)="search($event)"
      placeholder="Search"
      [sbbAutocomplete]="auto1"
    >
    </sbb-search>
    <sbb-autocomplete #auto1="sbbAutocomplete">
      <sbb-option *ngFor="let option of filteredOptions" [value]="option">
        {{ option }}
      </sbb-option>
    </sbb-autocomplete>
  `,
})
export class SimpleSearchAutocompleteHeaderComponent {
  lastSearch = '';
  @ViewChild(SbbSearch, { static: true }) searchComponent: SbbSearch;

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

  search($event: any) {
    this.lastSearch = $event;
  }
}

describe('SbbSearch', () => {
  describe('without autocomplete', () => {
    let component: SimpleSearchComponent;
    let fixture: ComponentFixture<SimpleSearchComponent>;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [SbbSearchModule, NoopAnimationsModule, SbbIconTestingModule],
          declarations: [SimpleSearchComponent],
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleSearchComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show a placeholder', () => {
      expect(component.searchComponent.placeholder).toBe('Search');
    });

    describe('when pressing the ENTER key', () => {
      it('should emit a search event', () => {
        expect(component.searchCounter).toBe(0);
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER);
        fixture.detectChanges();
        expect(component.searchCounter).toBe(1);
      });
    });

    describe('when clicking on the search button', () => {
      it('should emit a search event', () => {
        expect(component.searchCounter).toBe(0);
        const searchButton = fixture.debugElement.query(By.css('.sbb-search-box > button'));
        searchButton.nativeElement.click();
        expect(component.searchCounter).toBe(1);
      });
    });
  });

  describe('with autocomplete', () => {
    let component: SimpleSearchAutocompleteComponent;
    let fixture: ComponentFixture<SimpleSearchAutocompleteComponent>;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            SbbSearchModule,
            NoopAnimationsModule,
            SbbAutocompleteModule,
            OverlayModule,
            SbbIconTestingModule,
          ],
          declarations: [SimpleSearchAutocompleteComponent],
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleSearchAutocompleteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('when focusing input', () => {
      it('should open the options panel', () => {
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        expect(component.searchComponent.autocomplete.isOpen).toBe(true);
      });
    });

    describe('when clicking on an option', () => {
      it('should emit a search event with the selected value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('sbb-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.lastSearch).toBe('Eins');
      });

      it('should close the autocomplete panel', () => {
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        expect(component.searchComponent.autocomplete.isOpen).toBe(true);
        const options = fixture.debugElement.queryAll(By.css('sbb-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
      });

      it('should have selected value as input value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('sbb-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();
        expect(input.nativeElement.value).toBe('Eins');
      });
    });

    describe('when selecting an option with ENTER key', () => {
      let downArrowEvent: KeyboardEvent;
      let upArrowEvent: KeyboardEvent;
      let enterEvent: KeyboardEvent;

      beforeEach(() => {
        downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
        upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
        enterEvent = createKeyboardEvent('keydown', ENTER);
      });

      it('should emit a search event with the selected value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(downArrowEvent);
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(enterEvent);
        fixture.detectChanges();
        expect(component.lastSearch).toBe('Eins');
      });

      it('should close the autocomplete panel', () => {
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(downArrowEvent);
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(enterEvent);
        fixture.detectChanges();
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
      });

      it('should have selected value as input value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(downArrowEvent);
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(enterEvent);
        fixture.detectChanges();
        expect(input.nativeElement.value).toBe('Eins');
      });
    });

    describe('when starting to search', () => {
      function openAutocompletePanel(input: DebugElement) {
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        expect(component.searchComponent.autocomplete.isOpen).toBe(true);
      }

      it('should close autocomplete panel when pressing search button', () => {
        // open panel
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        openAutocompletePanel(input);

        // press search button
        const searchButton = fixture.debugElement.query(By.css('.sbb-search-box > button'));
        searchButton.nativeElement.click();
        fixture.detectChanges();

        // expect panel to be closed
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
      });

      it('should close autocomplete panel by keyboard', () => {
        // open panel
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        openAutocompletePanel(input);

        // hit enter on input field
        dispatchKeyboardEvent(input.nativeElement, 'keydown', ENTER, 'Enter');
        fixture.detectChanges();

        // expect panel to be closed
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
      });
    });
  });

  describe('header mode', () => {
    describe('without autocomplete', () => {
      let component: SimpleSearchHeaderComponent;
      let fixture: ComponentFixture<SimpleSearchHeaderComponent>;

      beforeEach(
        waitForAsync(() => {
          TestBed.configureTestingModule({
            imports: [
              SbbSearchModule,
              BrowserAnimationsModule,
              SbbAutocompleteModule,
              OverlayModule,
              SbbIconTestingModule,
            ],
            declarations: [SimpleSearchHeaderComponent],
          }).compileComponents();
        })
      );

      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleSearchHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      describe('when clicking on the trigger', () => {
        it('should show the search box', () => {
          const searchBox = fixture.debugElement.query(By.css('.sbb-search-box'));
          expect(getComputedStyle(searchBox.nativeElement).display).toBe('none');
          const trigger = fixture.debugElement.query(By.css('.sbb-search-icon-wrapper'));
          dispatchFakeEvent(trigger.nativeElement, 'focus');

          trigger.nativeElement.click();
          fixture.detectChanges();
          expect(getComputedStyle(searchBox.nativeElement).display).toBe('flex');
        });

        it('should hide the trigger itself', () => {
          const searchBox = fixture.debugElement.query(By.css('.sbb-search-box'));
          expect(getComputedStyle(searchBox.nativeElement).display).toBe('none');
          const trigger = fixture.debugElement.query(By.css('.sbb-search-icon-wrapper'));
          trigger.nativeElement.click();
          fixture.detectChanges();
          expect(component.searchComponent.hideSearch).toBe(false);
        });
      });
    });

    describe('with autocomplete', () => {
      let component: SimpleSearchAutocompleteHeaderComponent;
      let fixture: ComponentFixture<SimpleSearchAutocompleteHeaderComponent>;

      beforeEach(
        waitForAsync(() => {
          TestBed.configureTestingModule({
            imports: [
              SbbSearchModule,
              NoopAnimationsModule,
              SbbAutocompleteModule,
              OverlayModule,
              SbbIconTestingModule,
            ],
            declarations: [SimpleSearchAutocompleteHeaderComponent],
          }).compileComponents();
        })
      );

      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleSearchAutocompleteHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      describe('when clicking on the trigger', () => {
        it('should show the search box', () => {
          const searchBox = fixture.debugElement.query(By.css('.sbb-search-box'));
          expect(getComputedStyle(searchBox.nativeElement).display).toBe('none');
          const trigger = fixture.debugElement.query(By.css('.sbb-search-icon-wrapper'));
          dispatchFakeEvent(trigger.nativeElement, 'focus');

          trigger.nativeElement.click();
          fixture.detectChanges();
          expect(getComputedStyle(searchBox.nativeElement).display).toBe('flex');
        });

        it('should hide the trigger itself', () => {
          const searchBox = fixture.debugElement.query(By.css('.sbb-search-box'));
          expect(getComputedStyle(searchBox.nativeElement).display).toBe('none');
          const trigger = fixture.debugElement.query(By.css('.sbb-search-icon-wrapper'));
          trigger.nativeElement.click();
          fixture.detectChanges();
          expect(component.searchComponent.hideSearch).toBe(false);
        });
      });
    });
  });
});

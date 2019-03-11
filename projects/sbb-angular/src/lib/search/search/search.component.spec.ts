import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { SearchModule } from '../search.module';
import { SearchComponent } from '../search';
import { Component, ViewChild } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { dispatchKeyboardEvent, dispatchFakeEvent } from '../../_common/testing/dispatch-events';
import { ENTER, DOWN_ARROW, UP_ARROW, TAB } from '@angular/cdk/keycodes';
import { AutocompleteModule } from '../../autocomplete/autocomplete';
import { OptionModule } from '../../option/option';
import { OverlayModule } from '@angular/cdk/overlay';
import { createKeyboardEvent } from '../../_common/testing/event-objects';

@Component({
  selector: 'sbb-simple-search-component',
  template: `
  <sbb-search (search)="search()" placeholder="Suchen">
  </sbb-search>
  `
})
export class SimpleSearchComponent {

  searchCounter = 0;
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  search() {
    this.searchCounter++;
  }

}

@Component({
  selector: 'sbb-simple-search-autocomplete-component',
  template: `
  <sbb-search (search)="search($event)" placeholder="Suchen" [sbbAutocomplete]="auto1">
  </sbb-search>
  <sbb-autocomplete #auto1="sbbAutocomplete">
  <sbb-option *ngFor="let option of filteredOptions" [value]="option">
    {{ option }}
  </sbb-option>
</sbb-autocomplete>
`
})
export class SimpleSearchAutocompleteComponent {

  lastSearch = '';
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  options: string[] = ['Eins', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn'];
  filteredOptions = this.options.slice(0);


  search($event) {
    this.lastSearch = $event;
  }

}

@Component({
  selector: 'sbb-simple-search-header-component',
  template: `
  <sbb-search mode="header" (search)="search()" placeholder="Suchen">
  </sbb-search>
  `
})
export class SimpleSearchHeaderComponent {

  searchCounter = 0;
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  search() {
    this.searchCounter++;
  }

}

@Component({
  selector: 'sbb-simple-search-autocomplete-header-component',
  template: `
  <sbb-search mode="header" (search)="search($event)" placeholder="Suchen" [sbbAutocomplete]="auto1">
  </sbb-search>
  <sbb-autocomplete #auto1="sbbAutocomplete">
  <sbb-option *ngFor="let option of filteredOptions" [value]="option">
    {{ option }}
  </sbb-option>
</sbb-autocomplete>
`
})
export class SimpleSearchAutocompleteHeaderComponent {

  lastSearch = '';
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  options: string[] = ['Eins', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn'];
  filteredOptions = this.options.slice(0);


  search($event) {
    this.lastSearch = $event;
  }

}

describe('SearchComponent', () => {
  describe('without autocomplete', () => {
    let component: SimpleSearchComponent;
    let fixture: ComponentFixture<SimpleSearchComponent>;


    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [SearchModule, NoopAnimationsModule],
        declarations: [SimpleSearchComponent]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleSearchComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show a placeholder', () => {
      expect(component.searchComponent.placeholder).toBe('Suchen');
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

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [SearchModule, NoopAnimationsModule, AutocompleteModule, OptionModule, OverlayModule],
        declarations: [SimpleSearchAutocompleteComponent]
      }).compileComponents();

    }));

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
      let DOWN_ARROW_EVENT: KeyboardEvent;
      let UP_ARROW_EVENT: KeyboardEvent;
      let ENTER_EVENT: KeyboardEvent;

      beforeEach(() => {
        DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);
        UP_ARROW_EVENT = createKeyboardEvent('keydown', UP_ARROW);
        ENTER_EVENT = createKeyboardEvent('keydown', ENTER);
      });

      it('should emit a search event with the selected value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(DOWN_ARROW_EVENT);
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(ENTER_EVENT);
        fixture.detectChanges();
        expect(component.lastSearch).toBe('Eins');
      });

      it('should close the autocomplete panel', () => {
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(DOWN_ARROW_EVENT);
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(ENTER_EVENT);
        fixture.detectChanges();
        expect(component.searchComponent.autocomplete.isOpen).toBe(false);

      });

      it('should have selected value as input value', () => {
        const input = fixture.debugElement.query(By.css('.sbb-search-box > input'));
        dispatchFakeEvent(input.nativeElement, 'focusin');
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(DOWN_ARROW_EVENT);
        fixture.detectChanges();
        fixture.componentInstance.searchComponent.handleKeydown(ENTER_EVENT);
        fixture.detectChanges();
        expect(input.nativeElement.value).toBe('Eins');
      });
    });
  });

  describe('header mode', () => {
    describe('without autocomplete', () => {
      let component: SimpleSearchHeaderComponent;
      let fixture: ComponentFixture<SimpleSearchHeaderComponent>;

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [SearchModule, NoopAnimationsModule, AutocompleteModule, OptionModule, OverlayModule],
          declarations: [SimpleSearchHeaderComponent]
        }).compileComponents();

      }));

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

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [SearchModule, NoopAnimationsModule, AutocompleteModule, OptionModule, OverlayModule],
          declarations: [SimpleSearchAutocompleteHeaderComponent]
        }).compileComponents();

      }));

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

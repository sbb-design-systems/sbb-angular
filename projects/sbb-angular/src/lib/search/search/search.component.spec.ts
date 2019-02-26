import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SearchModule } from '../search.module';
import { SearchComponent } from '../search';
import { Component, ViewChild } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { dispatchKeyboardEvent } from '../../_common/testing/dispatch-events';

@Component({
  selector: 'sbb-simple-search-component',
  template: `
  <sbb-search (search)="search()" placeholder="Suchen">
  </sbb-search>  `
})
export class SimpleSearchComponent {

  searchCounter = 0;
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  search() {
    this.searchCounter++;
  }

}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchModule, NoopAnimationsModule],
      declarations: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});


fdescribe('SearchComponent without autocomplete', () => {
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

  describe('should emit a search event', () => {

    it('when pressing the ENTER key', () => {
      expect(component.searchCounter).toBe(0);
      const searchButton = fixture.debugElement.query(By.css('.sbb-search-box > input'));
/*       dispatchKeyboardEvent(searchButton.nativeElement, '')
 */      expect(component.searchCounter).toBe(1);
    });

    it('when clicking on the search icon button', () => {
      expect(component.searchCounter).toBe(1);
      const searchButton = fixture.debugElement.query(By.css('.sbb-search-box > button'));
      searchButton.nativeElement.click();
      expect(component.searchCounter).toBe(2);
    });
  });

});
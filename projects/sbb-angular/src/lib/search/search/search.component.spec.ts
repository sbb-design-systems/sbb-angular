import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SearchModule } from '../search.module';
import { SearchComponent } from '../search';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'sbb-simple-search-component',
  template: `
  <sbb-search></sbb-search>
  `
})
export class SimpleSearchComponent {

}


describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchModule, NoopAnimationsModule],
      declarations: [SimpleSearchComponent]
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

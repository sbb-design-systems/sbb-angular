import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SearchModule } from '../search.module';
import { SearchComponent } from '../search';
import { Component } from '@angular/core';

@Component({
  selector: 'sbb-simple-search-component',
  template: `
  <sbb-search></sbb-search>
  `
})
export class SimpleSearchComponent {

}


fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchModule],
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

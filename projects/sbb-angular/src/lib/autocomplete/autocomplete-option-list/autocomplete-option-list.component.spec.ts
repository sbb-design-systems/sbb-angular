import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteOptionListComponent } from './autocomplete-option-list.component';
import { AutocompleteOptionComponent } from '../autocomplete-option/autocomplete-option.component';
import { HighlightPipe } from '../autocomplete-option/highlight.pipe';

describe('AutocompleteOptionListComponent', () => {
  let component: AutocompleteOptionListComponent;
  let fixture: ComponentFixture<AutocompleteOptionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteOptionListComponent, AutocompleteOptionComponent, HighlightPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteOptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

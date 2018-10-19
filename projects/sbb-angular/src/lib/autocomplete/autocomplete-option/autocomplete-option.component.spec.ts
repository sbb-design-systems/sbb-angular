import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightPipe } from './highlight.pipe';
import { AutocompleteOptionComponent } from './autocomplete-option.component';

describe('AutocompleteOptionComponent', () => {
  let component: AutocompleteOptionComponent;
  let fixture: ComponentFixture<AutocompleteOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteOptionComponent, HighlightPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

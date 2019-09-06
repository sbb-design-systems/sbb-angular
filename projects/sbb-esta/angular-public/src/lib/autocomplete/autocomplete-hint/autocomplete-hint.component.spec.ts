import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteHintComponent } from './autocomplete-hint.component';

describe('AutocompleteHintComponent', () => {
  let component: AutocompleteHintComponent;
  let fixture: ComponentFixture<AutocompleteHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteHintComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

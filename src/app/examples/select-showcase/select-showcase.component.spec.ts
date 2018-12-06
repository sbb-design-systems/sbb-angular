import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectShowcaseComponent } from './select-showcase.component';

describe('SelectShowcaseComponent', () => {
  let component: SelectShowcaseComponent;
  let fixture: ComponentFixture<SelectShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectShowcaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

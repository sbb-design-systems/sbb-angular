import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleOptionComponent } from './toggle-option.component';

describe('ToggleOptionComponent', () => {
  let component: ToggleOptionComponent;
  let fixture: ComponentFixture<ToggleOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

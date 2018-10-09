import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbFieldComponent } from './sbb-field.component';

describe('SbbFieldComponent', () => {
  let component: SbbFieldComponent;
  let fixture: ComponentFixture<SbbFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbbFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaBasicComponent } from './text-area-basic.component';

describe('TextAreaBasicComponent', () => {
  let component: TextAreaBasicComponent;
  let fixture: ComponentFixture<TextAreaBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextAreaBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

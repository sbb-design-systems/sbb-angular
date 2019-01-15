import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextexpandComponent } from './textexpand.component';

describe('TextexpandComponent', () => {
  let component: TextexpandComponent;
  let fixture: ComponentFixture<TextexpandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextexpandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextexpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

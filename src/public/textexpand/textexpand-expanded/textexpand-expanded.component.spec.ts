import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextexpandExpandedComponent } from './textexpand-expanded.component';

describe('TextexpandExpandedComponent', () => {
  let component: TextexpandExpandedComponent;
  let fixture: ComponentFixture<TextexpandExpandedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextexpandExpandedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextexpandExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

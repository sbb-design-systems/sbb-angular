import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextexpandCollapsedComponent } from './textexpand-collapsed.component';

describe('TextexpandCollapsedComponent', () => {
  let component: TextexpandCollapsedComponent;
  let fixture: ComponentFixture<TextexpandCollapsedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextexpandCollapsedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextexpandCollapsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

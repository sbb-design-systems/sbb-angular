import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { TextexpandCollapsedComponent } from './textexpand-collapsed.component';

describe('TextexpandCollapsedComponent', () => {
  let component: TextexpandCollapsedComponent;
  let fixture: ComponentFixture<TextexpandCollapsedComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TextexpandCollapsedComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextexpandCollapsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

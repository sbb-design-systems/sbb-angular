import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { TextexpandExpandedComponent } from './textexpand-expanded.component';

describe('TextexpandExpandedComponent', () => {
  let component: TextexpandExpandedComponent;
  let fixture: ComponentFixture<TextexpandExpandedComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TextexpandExpandedComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextexpandExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureEventListenerComponent} from './feature-event-listener.component';

describe('FeatureEventListenerComponent', () => {
  let component: FeatureEventListenerComponent;
  let fixture: ComponentFixture<FeatureEventListenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureEventListenerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureEventListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

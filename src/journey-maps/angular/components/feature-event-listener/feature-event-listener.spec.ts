import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbbJourneyMapsModule } from '../../journey-maps.module';

import { SbbFeatureEventListener } from './feature-event-listener';

describe('FeatureEventListener', () => {
  let component: SbbFeatureEventListener;
  let fixture: ComponentFixture<SbbFeatureEventListener>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SbbJourneyMapsModule, NoopAnimationsModule, HttpClientModule],
    });
    fixture = TestBed.createComponent(SbbFeatureEventListener);
    component = fixture.componentInstance;
  });

  it('should unselect POIs and teasers / popups', () => {
    component.overlayVisible = true;
    component.overlayFeatures = [
      {
        featureDataType: 'POI',
      } as any,
      {
        featureDataType: 'MARKER',
      } as any,
    ];

    component.unselectFeaturesOfType(['POI']);

    expect(component.overlayVisible).toBeFalse();
    expect(component.overlayFeatures.length).toBe(1);
    expect(component.overlayFeatures[0].featureDataType).toBe('MARKER');
  });
});

import { HttpClientModule } from '@angular/common/http';
import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbbJourneyMapsModule } from '../../journey-maps.module';
import { SbbTestData } from '../../services/test-data';

import { SbbMarkerDetails } from './marker-details';

describe('MarkerDetailsComponent', () => {
  const testData = new SbbTestData();

  let closeClicked = false;
  let component: SbbMarkerDetails;
  let fixture: ComponentFixture<SbbMarkerDetails>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SbbJourneyMapsModule, NoopAnimationsModule, HttpClientModule],
    });
    fixture = TestBed.createComponent(SbbMarkerDetails);
    component = fixture.componentInstance;
  });

  it('shouldRender should return false if !selectedMarker', () => {
    [undefined, undefined, undefined].forEach((selectedMarker) => {
      component.selectedMarker = selectedMarker;
      component.template = 1 as unknown as TemplateRef<any>;
      component.ngOnChanges(undefined);
      expect(component.shouldRender).toBeFalse();
    });
  });

  it('shouldRender should return false if !template', () => {
    component.selectedMarker = testData.createMarker();
    component.ngOnChanges(undefined);
    expect(component.shouldRender).toBeFalse();
  });

  it('shouldRender should return true if selectedMarker and template', () => {
    component.selectedMarker = testData.createMarker();
    component.template = 1 as unknown as TemplateRef<any>;
    component.ngOnChanges(undefined);
    expect(component.shouldRender).toBeTrue();
  });

  it('should emit closeClicked event if escape key is clicked', () => {
    component.closeClicked.subscribe(() => (closeClicked = true));
    component.selectedMarker = testData.createMarker();
    fixture.detectChanges();
    expect(closeClicked).toBeFalse();
    component.onEscapePressed();
    expect(closeClicked).toBeTrue();
  });
});

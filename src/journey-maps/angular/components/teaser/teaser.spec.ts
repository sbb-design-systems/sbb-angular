import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbbJourneyMapsModule } from '../../journey-maps.module';
import { SbbTestData } from '../../services/test-data';

import { SbbTeaser } from './teaser';

describe('TeaserComponent', () => {
  const testData = new SbbTestData();

  let component: SbbTeaser;
  let fixture: ComponentFixture<SbbTeaser>;
  let closeClicked: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SbbJourneyMapsModule, NoopAnimationsModule, HttpClientModule],
    });
    fixture = TestBed.createComponent(SbbTeaser);
    component = fixture.componentInstance;
    component.rendered = true;
    closeClicked = false;
  });

  it('should emit closeClicked event if close button is clicked', () => {
    component.closeClicked.subscribe(() => (closeClicked = true));
    component.templateContext = testData.createMarker();
    fixture.detectChanges();
    expect(closeClicked).toBeFalse();
    getCloseButtonDe().nativeElement.click();
    expect(closeClicked).toBeTrue();
  });

  const getCloseButtonDe = () => fixture.debugElement.query(By.css('[data-testid="close-button"]'));
});

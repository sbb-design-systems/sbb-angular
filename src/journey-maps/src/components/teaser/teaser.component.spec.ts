import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TeaserComponent} from './teaser.component';
import {JourneyMapsClientModule} from '../../journey-maps-client.module';
import {TestDataService} from '../../services/test-data.service';
import {HttpClientModule} from '@angular/common/http';

describe('TeaserComponent', () => {
  const testData = new TestDataService();

  let component: TeaserComponent;
  let fixture: ComponentFixture<TeaserComponent>;
  let closeClicked: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JourneyMapsClientModule, NoopAnimationsModule, HttpClientModule],
    });
    fixture = TestBed.createComponent(TeaserComponent);
    component = fixture.componentInstance;
    component.rendered = true;
    closeClicked = false;
  });

  it('should emit closeClicked event if close button is clicked', () => {
    component.closeClicked.subscribe(() => closeClicked = true);
    component.templateContext = testData.createMarker();
    fixture.detectChanges();
    expect(closeClicked).toBeFalse();
    getCloseButtonDe().nativeElement.click();
    expect(closeClicked).toBeTrue();
  });

  const getCloseButtonDe = () => fixture.debugElement.query(By.css('[data-testid="close-button"]'));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbLeitPoi } from './leit-poi';

describe('LeitPoiComponent', () => {
  let component: SbbLeitPoi;
  let fixture: ComponentFixture<SbbLeitPoi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SbbLeitPoi],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbLeitPoi);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit switchLevel with nextLevel on click"', (doneFn) => {
    const compiled = bindFeatureInput({ destinationLevel: 1 });
    component.switchLevel.subscribe((nextLevel) => {
      expect(nextLevel).toEqual(1);
      doneFn();
    });
    compiled.querySelector('.poi_container').click();
  });

  it('should show lift and downstairs icons and level -2"', () => {
    const compiled = bindFeatureInput({
      travelType: 'lift',
      travelDirection: 'downstairs',
      placement: 'northeast',
      sourceLevel: -4,
      location: [0, 0],
      destinationLevel: -2,
    });

    expect(compiled.querySelector('.travel_type_lift')).toBeTruthy();
    expect(compiled.querySelector('.travel_direction_downstairs')).toBeTruthy();
    expect(compiled.querySelector('.travel_destination_level').textContent).toContain('-2');
  });

  it('should show escalator and upstairs icons and level 0"', () => {
    const compiled = bindFeatureInput({
      travelType: 'escalator',
      travelDirection: 'upstairs',
      placement: 'southwest',
      sourceLevel: -1,
      location: [0, 0],
      destinationLevel: 0,
    });

    expect(compiled.querySelector('.travel_type_escalator')).toBeTruthy();
    expect(compiled.querySelector('.travel_direction_upstairs')).toBeTruthy();
    expect(compiled.querySelector('.travel_destination_level').textContent).toContain('0');
  });

  const bindFeatureInput = (feature: any): any => {
    component.feature = feature;
    // bind feature input
    fixture.detectChanges();
    // and return debug native element
    return fixture.debugElement.nativeElement;
  };
});

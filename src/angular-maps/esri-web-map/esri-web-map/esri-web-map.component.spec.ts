import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbEsriWebMap } from './esri-web-map.component';

describe('SbbEsriWebMap', () => {
  let component: SbbEsriWebMap;
  let fixture: ComponentFixture<SbbEsriWebMap>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbEsriWebMap],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriWebMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

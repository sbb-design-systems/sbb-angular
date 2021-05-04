import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbEsriLegend } from './esri-legend.component';

describe('SbbEsriLegend', () => {
  let component: SbbEsriLegend;
  let fixture: ComponentFixture<SbbEsriLegend>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbEsriLegend],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriLegend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

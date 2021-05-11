import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbEsriLayerList } from './esri-layer-list.component';

describe('SbbEsriLayerList', () => {
  let component: SbbEsriLayerList;
  let fixture: ComponentFixture<SbbEsriLayerList>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbEsriLayerList],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriLayerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

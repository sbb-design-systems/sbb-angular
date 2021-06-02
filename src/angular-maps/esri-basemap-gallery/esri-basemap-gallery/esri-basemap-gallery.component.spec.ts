import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbEsriBasemapGallery } from './esri-basemap-gallery.component';

describe('SbbEsriBasemapGallery', () => {
  let component: SbbEsriBasemapGallery;
  let fixture: ComponentFixture<SbbEsriBasemapGallery>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbEsriBasemapGallery],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriBasemapGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

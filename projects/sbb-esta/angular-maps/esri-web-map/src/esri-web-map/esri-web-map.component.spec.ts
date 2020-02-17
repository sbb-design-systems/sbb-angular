import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsriWebMapComponent } from './esri-web-map.component';

describe('EsriWebMapComponent', () => {
  let component: EsriWebMapComponent;
  let fixture: ComponentFixture<EsriWebMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EsriWebMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriWebMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

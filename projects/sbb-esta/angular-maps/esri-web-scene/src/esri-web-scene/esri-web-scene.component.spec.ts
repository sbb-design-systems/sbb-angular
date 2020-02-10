import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsriWebSceneComponent } from './esri-web-scene.component';

describe('EsriWebSceneComponent', () => {
  let component: EsriWebSceneComponent;
  let fixture: ComponentFixture<EsriWebSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EsriWebSceneComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriWebSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbEsriWebScene } from './esri-web-scene.component';

describe('SbbEsriWebScene', () => {
  let component: SbbEsriWebScene;
  let fixture: ComponentFixture<SbbEsriWebScene>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbbEsriWebScene],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriWebScene);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

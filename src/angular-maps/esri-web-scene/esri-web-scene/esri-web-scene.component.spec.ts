import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SbbEsriWebScene } from './esri-web-scene.component';

describe('SbbEsriWebScene', () => {
  let component: SbbEsriWebScene;
  let fixture: ComponentFixture<SbbEsriWebScene>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbEsriWebScene],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbEsriWebScene);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

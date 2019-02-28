import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhettoboxContainerComponent } from './ghettobox-container.component';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { GhettoboxComponent } from '../ghettobox/ghettobox.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IconCollectionModule } from '../../svg-icons/svg-icons';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GhettoboxContainerService } from './ghettobox-container.service';
import { GhettoboxService } from '../ghettobox/ghettobox.service';
import { By } from '@angular/platform-browser';
import { Ghettobox } from '../ghettobox/ghettobox-ref';
import { LinkGeneratorResult } from '../../pagination/pagination';
import { PortalModule } from '@angular/cdk/portal';

@Component({
  selector: 'sbb-ghettobox-test',
  template: `
  <sbb-ghettobox-container>
    <sbb-ghettobox>
      This is an initial ghettobox into a container.
    </sbb-ghettobox>
  </sbb-ghettobox-container>

  <ng-template #testIcon1>
    <sbb-icon-him-replacementbus></sbb-icon-him-replacementbus>
  </ng-template>
  `,
  entryComponents: [GhettoboxComponent]
})
export class GhettoboxContainerTestComponent {

  @ViewChild('testIcon1', { read: TemplateRef })
  testIcon: TemplateRef<any>;

}

const linkGenerator = (): LinkGeneratorResult => {
  return {
    routerLink: ['.'],
    queryParams: { test: 10 },
    fragment: 'test'
  };
};

fdescribe('GhettoboxContainerComponent', () => {
  let component: GhettoboxContainerTestComponent;
  let fixture: ComponentFixture<GhettoboxContainerTestComponent>;
  let ghettoboxService: GhettoboxService;
  let ghettoboxContainerService: GhettoboxContainerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IconCollectionModule,
        NoopAnimationsModule,
        PortalModule
      ],
      declarations: [
        GhettoboxContainerComponent,
        GhettoboxContainerTestComponent,
        GhettoboxComponent
      ],
      providers: [
        GhettoboxContainerService,
        GhettoboxService
      ]
    })
      .compileComponents();

    ghettoboxService = TestBed.get(GhettoboxService);
    ghettoboxContainerService = TestBed.get(GhettoboxContainerService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhettoboxContainerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind proper accessibility attributes', () => {
    const ghettoContainer = fixture.debugElement.query(By.directive(GhettoboxContainerComponent));

    expect(ghettoContainer.nativeElement.getAttribute('role')).toEqual('region');
    expect(ghettoContainer.nativeElement.getAttribute('aria-live')).toEqual('assertive');
    expect(ghettoContainer.nativeElement.getAttribute('aria-relevant')).toEqual('all');
    expect(ghettoContainer.nativeElement.getAttribute('tabindex')).toEqual('-1');
  });

  it('should project the intial ghettobox', () => {
    const projectedGhetto = fixture.debugElement.query(By.directive(GhettoboxComponent));

    expect(projectedGhetto.componentInstance).toBeTruthy();
  });

  it('should be able to add a Ghettobox via GhettoboxService', async () => {
    const ghettoboxToAdd: Ghettobox = { message: 'TEST MESSAGE', link: linkGenerator(), icon: component.testIcon };

    ghettoboxService.add(ghettoboxToAdd);

    fixture.detectChanges();
    await fixture.whenStable();

    const ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));

    expect(ghettoboxes.length).toEqual(2);

  });

  it('should be able to delete a Ghettobox by ID via GhettoboxService', () => {

  });

  it('should be able to delete a Ghettobox by INDEX via GhettoboxService', () => {

  });

  it('should be able to delete a Ghettobox from GhettoboxRef delete method', () => {

  });

  it('should be able to clear all Ghettoboxes via GhettoboxService', () => {

  });

});

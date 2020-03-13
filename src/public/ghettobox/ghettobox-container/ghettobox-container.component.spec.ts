import { PortalModule } from '@angular/cdk/portal';
import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LinkGeneratorResult } from '@sbb-esta/angular-core/models';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import { Ghettobox } from '../ghettobox/ghettobox-ref';
import { GhettoboxComponent } from '../ghettobox/ghettobox.component';
import { GhettoboxService } from '../ghettobox/ghettobox.service';

import { GhettoboxContainerComponent } from './ghettobox-container.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-ghettobox-container-test',
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

describe('GhettoboxContainerComponent', () => {
  let component: GhettoboxContainerTestComponent;
  let fixture: ComponentFixture<GhettoboxContainerTestComponent>;
  let ghettoboxService: GhettoboxService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, IconCollectionModule, NoopAnimationsModule, PortalModule],
      declarations: [
        GhettoboxContainerComponent,
        GhettoboxContainerTestComponent,
        GhettoboxComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    ghettoboxService = TestBed.inject(GhettoboxService);
    fixture = TestBed.createComponent(GhettoboxContainerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind proper accessibility attributes', () => {
    const element = fixture.debugElement.query(By.directive(GhettoboxContainerComponent))
      .nativeElement;

    expect(element.getAttribute('role')).toEqual('region');
    expect(element.getAttribute('aria-live')).toEqual('assertive');
    expect(element.getAttribute('aria-relevant')).toEqual('all');
    expect(element.getAttribute('tabindex')).toEqual('-1');
  });

  it('should project the intial ghettobox', () => {
    const projectedGhetto = fixture.debugElement.query(By.directive(GhettoboxComponent));

    expect(projectedGhetto.componentInstance).toBeTruthy();
  });

  it('should be able to add a Ghettobox via GhettoboxService', async () => {
    const ghettoboxToAdd: Ghettobox = {
      message: 'TEST MESSAGE',
      link: linkGenerator(),
      icon: component.testIcon
    };

    ghettoboxService.add(ghettoboxToAdd);

    fixture.detectChanges();
    await fixture.whenStable();

    const ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));
    const icon = ghettoboxes[1].query(By.css('sbb-icon-him-replacementbus'));
    const linkHref = ghettoboxes[1]
      .query(By.css('.sbb-ghettobox-link'))
      .nativeElement.getAttribute('href');

    expect(ghettoboxes.length).toEqual(2);
    expect(ghettoboxes[1].componentInstance.ghettobox.message).toBe('TEST MESSAGE');
    expect(icon).toBeTruthy();
    expect(linkHref).toBe('/?test=10#test');
  });

  it('should be able to delete a Ghettobox by ID via GhettoboxService', async () => {
    let ghettoboxes: DebugElement[];
    const ghettoboxToAdd: Ghettobox = {
      message: 'TEST MESSAGE',
      link: linkGenerator(),
      icon: component.testIcon
    };

    ghettoboxService.add(ghettoboxToAdd);

    fixture.detectChanges();
    await fixture.whenStable();

    ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));

    expect(ghettoboxes.length).toEqual(2);

    const addedGhettoboxID = ghettoboxes[1].nativeElement.getAttribute('id');

    ghettoboxService.deleteById(addedGhettoboxID);

    fixture.detectChanges();
    await fixture.whenStable();

    ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));

    expect(ghettoboxes.length).toEqual(1);
    expect(ghettoboxService.attachedGhettoboxes.length).toEqual(1);
  });

  it('should be able to delete a Ghettobox by INDEX via GhettoboxService', async () => {
    let ghettoboxes: DebugElement[];
    const ghettoboxToAdd: Ghettobox = {
      message: 'TEST MESSAGE',
      link: linkGenerator(),
      icon: component.testIcon
    };

    ghettoboxService.add(ghettoboxToAdd);

    fixture.detectChanges();
    await fixture.whenStable();

    ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));

    expect(ghettoboxes.length).toEqual(2);

    ghettoboxService.deleteByIndex(1);

    fixture.detectChanges();
    await fixture.whenStable();

    ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));

    expect(ghettoboxes.length).toEqual(1);
    expect(ghettoboxService.attachedGhettoboxes.length).toEqual(1);
  });

  it('should be able to delete a Ghettobox from GhettoboxRef delete method', async () => {
    let ghettoboxes: DebugElement[];
    const ghettoboxToAdd: Ghettobox = {
      message: 'TEST MESSAGE',
      link: linkGenerator(),
      icon: component.testIcon
    };

    const addedGhettobox = ghettoboxService.add(ghettoboxToAdd);

    fixture.detectChanges();
    await fixture.whenStable();

    ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));

    expect(ghettoboxes.length).toEqual(2);

    addedGhettobox.delete();

    fixture.detectChanges();
    await fixture.whenStable();

    ghettoboxes = fixture.debugElement.queryAll(By.directive(GhettoboxComponent));

    expect(ghettoboxes.length).toEqual(1);
    expect(ghettoboxService.attachedGhettoboxes.length).toEqual(1);
  });

  it('should be able to clear all Ghettoboxes via GhettoboxService', async () => {
    const ghettoboxToAdd: Ghettobox = {
      message: 'TEST MESSAGE',
      link: linkGenerator(),
      icon: component.testIcon
    };

    ghettoboxService.add(ghettoboxToAdd);
    ghettoboxService.add(ghettoboxToAdd);

    fixture.detectChanges();
    await fixture.whenStable();

    const attachedGhettoboxesCopy = ghettoboxService.attachedGhettoboxes.slice();

    ghettoboxService.attachedGhettoboxes.forEach(g => {
      g.componentInstance.afterDelete.subscribe(gs => expect(gs.ghettoboxState).toBe('deleted'));
      expect(g.componentInstance.visible).toBe(true);
    });

    ghettoboxService.clearAll();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(ghettoboxService.attachedGhettoboxes).toEqual([]);

    attachedGhettoboxesCopy.forEach(g => {
      expect(g.componentInstance.visible).toBe(false);
    });
  });
});

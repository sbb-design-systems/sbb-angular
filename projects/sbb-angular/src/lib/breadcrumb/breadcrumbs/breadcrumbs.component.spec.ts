import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { CommonModule, Location } from '@angular/common';
import { DropdownModule } from '../../dropdown/dropdown';
import { IconArrowLeftModule, IconArrowSmallDownModule, IconHomeModule, IconLhMountainsViewsModule } from '../../svg-icons/svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { BreadcrumbModule } from '../breadcrumb.module';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { dispatchEvent, dispatchMouseEvent } from '../../_common/testing/dispatch-events';
import { createMouseEvent } from '../../_common/testing/event-objects';

@Component({
  selector: 'sbb-breadcrumbs-test',
  template: `<sbb-breadcrumbs>
                <sbb-breadcrumb>
                  <a routerLink="." [queryParams]="{ level: 'home' }" routerLinkActive="sbb-selected">
                    <sbb-icon-home></sbb-icon-home>
                  </a>
                </sbb-breadcrumb>
                <sbb-breadcrumb>
                  <a routerLink="." [queryParams]="{ level: '1' }" routerLinkActive="sbb-selected">Level 1</a>
                </sbb-breadcrumb>
                <sbb-breadcrumb>
                  <a routerLink="." [queryParams]="{ level: '2' }" routerLinkActive="sbb-selected">Level 2</a>
                </sbb-breadcrumb>
             </sbb-breadcrumbs>`
})
export class BreadcrumbsTestComponent {

  private route: ActivatedRoute;
}


@Component({
  selector: 'sbb-breadcrumbs-test2',
  template: `<sbb-breadcrumbs>
              <sbb-breadcrumb>
                <a routerLink="." [queryParams]="{ level: 'home' }" routerLinkActive="sbb-selected">
                  <sbb-icon-home></sbb-icon-home>
                </a>
              </sbb-breadcrumb>

              <sbb-breadcrumb>
                Level 1 with detail pages
                <sbb-dropdown>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1' }" routerLinkActive="sbb-selected">Level 1</a>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1b' }" routerLinkActive="sbb-selected">Level 1b</a>
                </sbb-dropdown>
              </sbb-breadcrumb>

              <sbb-breadcrumb>
                Level 2
                <sbb-dropdown>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '2' }"
                                                    routerLinkActive="sbb-selected">Level 2</a>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '2b' }"
                                                    routerLinkActive="sbb-selected">Level 2 with detail pages</a>
                </sbb-dropdown>
              </sbb-breadcrumb>
             </sbb-breadcrumbs> `
})
export class BreadcrumbsTest2Component {

  private route: ActivatedRoute;
}

@Component({
  selector: 'sbb-breadcrumbs-test3',
  template: `<sbb-breadcrumbs>
              <sbb-breadcrumb>
                <a routerLink="." [queryParams]="{ level: 'home' }">
                  <sbb-icon-home></sbb-icon-home>
                </a>
              </sbb-breadcrumb>

              <sbb-breadcrumb>
                Level 1 with detail pages
                <sbb-dropdown>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1' }"  routerLinkActive="sbb-selected">Level 1</a>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1b' }" routerLinkActive="sbb-selected">Level 1b</a>
                </sbb-dropdown>
              </sbb-breadcrumb>
             </sbb-breadcrumbs> `
})
export class BreadcrumbsTest3Component {

  private route: ActivatedRoute;
}


describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [
        CommonModule,
        DropdownModule,
        IconArrowLeftModule,
        IconArrowSmallDownModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


describe('Breadcrumb behaviour Test', () => {
  let component: BreadcrumbsTestComponent;
  let fixtureTest: ComponentFixture<BreadcrumbsTestComponent>;

  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbModule, RouterTestingModule, CommonModule, IconHomeModule],
      declarations: [BreadcrumbsTestComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbsTestComponent);
    component = fixtureTest.componentInstance;
    router = TestBed.get(Router);
    fixtureTest.detectChanges();
  });

  it('breadcrumb with navigation to home page', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: 'home' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[0];

      const linkHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')).nativeElement;

      dispatchEvent(linkHome, createMouseEvent('click'));
      fixtureTest.detectChanges();
      expect(location.path()).toContain('?level=home');

      const iconHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger > .sbb-icon-component')).nativeElement;
      expect(iconHome).toBeTruthy();
    });
  });

  it('breadcrumb with navigation to level 1 page', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: '1' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[1];

      const link1 = breadcrumbLevel1.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')).nativeElement;

      dispatchEvent(link1, createMouseEvent('click'));
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();

      expect(location.path()).toContain('?level=1');
    });
  });

  it('breadcrumb with navigation to level 2 page', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: '2' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevel2 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[2];

      const link2 = breadcrumbLevel2.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')).nativeElement;

      dispatchEvent(link2, createMouseEvent('click'));
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();

      expect(location.path()).toContain('?level=2');
    });
  });

});


describe('Breadcrumb behaviour Test 2', () => {
  let component: BreadcrumbsTest2Component;
  let fixtureTest: ComponentFixture<BreadcrumbsTest2Component>;

  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbModule, RouterTestingModule, CommonModule, IconHomeModule, DropdownModule],
      declarations: [BreadcrumbsTest2Component],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbsTest2Component);
    component = fixtureTest.componentInstance;
    router = TestBed.get(Router);
  });

  it('breadcrumb with navigation to home page', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: 'home' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[0];

      const linkHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')).nativeElement;

      dispatchEvent(linkHome, createMouseEvent('click'));
      fixtureTest.detectChanges();
      expect(location.path()).toContain('?level=home');

      const iconHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger > .sbb-icon-component')).nativeElement;
      expect(iconHome).toBeTruthy();
    });
  });

  it('breadcrumb with navigation to level 1 page with dropdown', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: '1', sub: '1' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[1];

      const dropdownTrigger = breadcrumbLevel1.query(By.css('.sbb-breadcrumb-trigger')).nativeElement;
      dropdownTrigger.click();
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();

      const subLink1 = fixtureTest.debugElement.queryAll(By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a'))[0].nativeElement;
      dispatchEvent(subLink1, createMouseEvent('click'));
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();
      expect(location.path()).toContain('?level=1&sub=1');

      const subLink2 = fixtureTest.debugElement.queryAll(By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a'))[1].nativeElement;
      dispatchEvent(subLink2, createMouseEvent('click'));
      await fixtureTest.whenStable();
      fixtureTest.detectChanges();
      expect(location.path()).toContain('?level=1&sub=1b');
    });
  });

  it('breadcrumb with navigation to level 2 page with dropdown', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: '1', sub: '2' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevel2 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[2];

      const dropdownTrigger = breadcrumbLevel2.query(By.css('.sbb-breadcrumb-trigger')).nativeElement;
      dropdownTrigger.click();
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();

      const subLink1 = fixtureTest.debugElement.queryAll(By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a'))[0].nativeElement;
      dispatchEvent(subLink1, createMouseEvent('click'));
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();

      expect(location.path()).toContain('?level=1&sub=2');

      const subLink2 = fixtureTest.debugElement.queryAll(By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a'))[1].nativeElement;
      dispatchEvent(subLink2, createMouseEvent('click'));
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();
      expect(location.path()).toContain('?level=1&sub=2b');
    });
  });
});


describe('Breadcrumb behaviour Test 3', () => {
  let component: BreadcrumbsTest3Component;
  let fixtureTest: ComponentFixture<BreadcrumbsTest3Component>;

  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbModule, RouterTestingModule, CommonModule, IconHomeModule, DropdownModule],
      declarations: [BreadcrumbsTest3Component],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbsTest3Component);
    component = fixtureTest.componentInstance;
    router = TestBed.get(Router);
  });

  it('breadcrumb with navigation to home page', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: 'home' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[0];

      const linkHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')).nativeElement;

      dispatchEvent(linkHome, createMouseEvent('click'));
      fixtureTest.detectChanges();
      expect(location.path()).toContain('?level=home');

      const iconHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger > .sbb-icon-component')).nativeElement;
      expect(iconHome).toBeTruthy();
    });
  });

  it('breadcrumb with navigation to level 1 page with dropdown', () => {

    fixtureTest.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixtureTest.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { level: '1', sub: '1' } });
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();
      const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbComponent))[1];

      const dropdownTrigger = breadcrumbLevel1.query(By.css('.sbb-breadcrumb-trigger')).nativeElement;
      dropdownTrigger.click();
      fixtureTest.detectChanges();

      await fixtureTest.whenStable();

      const subLink1 = fixtureTest.debugElement.queryAll(By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a'))[0].nativeElement;
      dispatchEvent(subLink1, createMouseEvent('click'));
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();
      expect(location.path()).toContain('?level=1&sub=1');

      const subLink2 = fixtureTest.debugElement.queryAll(By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a'))[1].nativeElement;
      dispatchEvent(subLink2, createMouseEvent('click'));
      await fixtureTest.whenStable();
      fixtureTest.detectChanges();
      expect(location.path()).toContain('?level=1&sub=1b');
    });
  });
});



import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { dispatchEvent } from '../../_common/testing/dispatch-events';
import { BreadcrumbComponent } from './breadcrumb.component';
import { CommonModule, Location } from '@angular/common';
import { DropdownModule } from '../../dropdown/dropdown';
import { IconArrowLeftModule, IconArrowSmallDownModule, IconHomeModule, IconLhMountainsViewsModule } from '../../svg-icons/svg-icons';
import { Component } from '@angular/core';
import { BreadcrumbModule } from '../breadcrumb.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BreadcrumbLevelComponent } from '../breadcrumb-level/breadcrumb-level.component';
import { createMouseEvent } from '../../_common/testing/event-objects';

@Component({
  selector: 'sbb-breadcrumb-test',
  template: `<sbb-breadcrumb>
               <sbb-breadcrumb-level>
                  <a routerLink="." [queryParams]="{ level: 'home' }" routerLinkActive="sbb-selected">
                    <sbb-icon-home></sbb-icon-home>
                  </a>
               </sbb-breadcrumb-level>

               <sbb-breadcrumb-level>
                 <a routerLink="." [queryParams]="{ level: '1' }" routerLinkActive="sbb-selected">Level 1</a>
               </sbb-breadcrumb-level>

               <sbb-breadcrumb-level>
                 <a routerLink="." [queryParams]="{ level: '2' }" routerLinkActive="sbb-selected">Level 2</a>
               </sbb-breadcrumb-level>
             </sbb-breadcrumb>
            `
})
export class BreadcrumbTestComponent {

  private route: ActivatedRoute;
}


@Component({
  selector: 'sbb-breadcrumb-test2',
  template: `<sbb-breadcrumb>
              <sbb-breadcrumb-level>
                <a routerLink="." [queryParams]="{ level: 'home' }" routerLinkActive="sbb-selected">
                  <sbb-icon-home></sbb-icon-home>
                </a>
              </sbb-breadcrumb-level>

              <sbb-breadcrumb-level label="Level 1 dasdasd  dasdasdas">
                <sbb-dropdown>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1' }" routerLinkActive="sbb-selected">Level 1</a>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1b' }" routerLinkActive="sbb-selected">Level 1b</a>
                </sbb-dropdown>
              </sbb-breadcrumb-level>

              <sbb-breadcrumb-level label="Level 2">
                <sbb-dropdown>
                  <a sbbDropdownItem routerLink="."  [queryParams]="{ level: '1', sub: '2' }" routerLinkActive="sbb-selected">Level 2</a>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '2b' }" routerLinkActive="sbb-selected">Level 2 as</a>
                </sbb-dropdown>
              </sbb-breadcrumb-level>
             </sbb-breadcrumb> `
})
export class BreadcrumbTest2Component {

  private route: ActivatedRoute;
}


@Component({
  selector: 'sbb-breadcrumb-test3',
  template: `<sbb-breadcrumb>
              <sbb-breadcrumb-level>
                <a routerLink="." [queryParams]="{ level: 'home' }" routerLinkActive="sbb-selected">
                  <sbb-icon-home></sbb-icon-home>
                </a>
              </sbb-breadcrumb-level>

              <sbb-breadcrumb-level label="Level 1 dasdasd  dasdasdas">
                <sbb-dropdown>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1' }" routerLinkActive="sbb-selected">Level 1</a>
                  <a sbbDropdownItem routerLink="." [queryParams]="{ level: '1', sub: '1b' }" routerLinkActive="sbb-selected">Level 1b</a>
                </sbb-dropdown>
              </sbb-breadcrumb-level> `
})
export class BreadcrumbTest3Component {

  private route: ActivatedRoute;
}


describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
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
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Breadcrumb behaviour Test', () => {
  let component: BreadcrumbTestComponent;
  let fixtureTest: ComponentFixture<BreadcrumbTestComponent>;

  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbModule, RouterTestingModule, CommonModule, IconHomeModule],
      declarations: [BreadcrumbTestComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbTestComponent);
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
      const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[0];

      const linkHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb-level > a')).nativeElement;

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
      const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[1];

      const link1 = breadcrumbLevel1.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb-level > a')).nativeElement;

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
      const breadcrumbLevel2 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[2];

      const link2 = breadcrumbLevel2.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb-level > a')).nativeElement;

      dispatchEvent(link2, createMouseEvent('click'));
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();

      expect(location.path()).toContain('?level=2');
    });
  });

});

describe('Breadcrumb behaviour Test 2', () => {
  let component: BreadcrumbTest2Component;
  let fixtureTest: ComponentFixture<BreadcrumbTest2Component>;

  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbModule, RouterTestingModule, CommonModule, IconHomeModule, DropdownModule],
      declarations: [BreadcrumbTest2Component],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbTest2Component);
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
      const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[0];

      const linkHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb-level > a')).nativeElement;

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
      const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[1];

      expect(breadcrumbLevel1.attributes['label']).toContain('Level 1 dasdasd  dasdasdas');

      const dropdownTrigger = breadcrumbLevel1.query(By.css('.sbb-breadcrumb-level-trigger')).nativeElement;
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
      const breadcrumbLevel2 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[2];

      expect(breadcrumbLevel2.attributes['label']).toContain('Level 2');

      const dropdownTrigger = breadcrumbLevel2.query(By.css('.sbb-breadcrumb-level-trigger')).nativeElement;
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
  let component: BreadcrumbTest3Component;
  let fixtureTest: ComponentFixture<BreadcrumbTest3Component>;

  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbModule, RouterTestingModule, CommonModule, IconHomeModule, DropdownModule],
      declarations: [BreadcrumbTest3Component],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbTest3Component);
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
      const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[0];

      const linkHome = breadcrumbLevelHomeComponent.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb-level > a')).nativeElement;

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
      const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(BreadcrumbLevelComponent))[1];

      expect(breadcrumbLevel1.attributes['label']).toContain('Level 1 dasdasd  dasdasdas');

      const dropdownTrigger = breadcrumbLevel1.query(By.css('.sbb-breadcrumb-level-trigger')).nativeElement;
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

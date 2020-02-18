import { CommonModule, Location } from '@angular/common';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LinkGeneratorResult } from '@sbb-esta/angular-core/models';
import { configureTestSuite } from 'ng-bullet';

import { DropdownModule } from '../dropdown.module';
import {
  DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER,
  DropdownItemDirective,
  DropdownOriginDirective,
  DropdownTriggerDirective
} from '../public_api';

import { DropdownComponent } from './dropdown.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-dropdown-test',
  template: `
    <button sbbButton type="button" [sbbDropdown]="dropdown">
      Open dropdown
    </button>
    <sbb-dropdown #dropdown="sbbDropdown">
      <a
        *ngFor="let link of links"
        sbbDropdownItem
        [routerLink]="linkGenerator(link.page).routerLink"
        [queryParams]="linkGenerator(link.page).queryParams"
        routerLinkActive="sbb-selected"
      >
        {{ link.text }}
      </a>

      <hr />
      <button sbbDropdownItem type="button" (click)="onClick()">
        Abmeldung
      </button>
    </sbb-dropdown>
  `
})
export class DropdownTestComponent {
  @ViewChildren(DropdownTriggerDirective)
  triggers: QueryList<DropdownTriggerDirective>;

  @ViewChild(DropdownComponent, { static: true })
  dropdown: DropdownComponent;

  links: Array<any> = [
    { page: 1, text: 'Test 1' },
    { page: 2, text: 'Test 2' },
    { page: 3, text: 'Test 3' }
  ];

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  onClick() {
    console.log('Button clicked');
  }

  addNewLink() {
    this.links.push({
      page: this.links.length + 1,
      text: 'Test ' + (this.links.length + 1)
    });
  }
}

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropdownComponent,
        DropdownItemDirective,
        DropdownOriginDirective,
        DropdownTriggerDirective
      ],
      imports: [CommonModule],
      providers: [DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('DropdownComponent test', () => {
  let component: DropdownTestComponent;
  let fixture: ComponentFixture<DropdownTestComponent>;
  let location: Location = null;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownTestComponent],
      imports: [DropdownModule, RouterTestingModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have four options', () => {
    expect(component.dropdown.options.length).toBe(4);
  });

  describe('clicking on the trigger', () => {
    it('should open the options list', () => {
      const trigger = fixture.debugElement.query(By.css('[sbbButton]'));
      trigger.nativeElement.click();
      fixture.detectChanges();
      const panel = fixture.debugElement.query(By.css('.sbb-dropdown-panel'));
      expect(panel).toBeTruthy();
      expect(component.dropdown.open).toBeTruthy();
    });

    it('should have a11y attributes correctly set', () => {
      const trigger = fixture.debugElement.query(By.css('[sbbButton]'));
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(trigger.attributes['aria-expanded']).toBeTruthy();
      expect(trigger.attributes['aria-owns']).toContain(component.dropdown.id);
    });

    it('should close the panel when clicked again', () => {
      const trigger = fixture.debugElement.query(By.css('[sbbButton]'));
      trigger.nativeElement.click();
      fixture.detectChanges();
      const panel = fixture.debugElement.query(By.css('.sbb-dropdown-panel'));
      expect(panel).toBeTruthy();
      expect(component.dropdown.open).toBeTruthy();
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(trigger.attributes['aria-expanded']).toBe('false');
      expect(component.dropdown.open).toBeFalsy();
    });
  });

  describe('clicking on the second option', () => {
    it('should change location to have page 2 query parameter', async(() => {
      fixture.ngZone.run(async () => {
        const trigger = fixture.debugElement.query(By.css('[sbbButton]'));
        trigger.nativeElement.click();
        fixture.detectChanges();
        router = TestBed.inject(Router);
        router.initialNavigation();
        location = TestBed.inject(Location);
        fixture.detectChanges();
        await fixture.whenStable();
        const links = fixture.debugElement.queryAll(By.css('[sbbDropdownItem]'));
        fixture.detectChanges();
        links[1].nativeElement.click();
        await fixture.whenStable();
        expect(location.path()).toContain('?page=2');
      });
    }));

    it('should apply sbb-selected class on the 2nd option', async(() => {
      fixture.ngZone.run(async () => {
        const trigger = fixture.debugElement.query(By.css('[sbbButton]'));
        trigger.nativeElement.click();
        fixture.detectChanges();
        router = TestBed.inject(Router);
        router.initialNavigation();
        location = TestBed.inject(Location);
        fixture.detectChanges();
        await fixture.whenStable();
        const links = fixture.debugElement.queryAll(By.css('[sbbDropdownItem]'));
        fixture.detectChanges();
        links[1].nativeElement.click();
        await fixture.whenStable();
        expect(links[1].classes['sbb-selected']).toBeTruthy();
      });
    }));
  });

  describe('adding a new link', () => {
    it('should add a new option', () => {
      expect(component.dropdown.options.length).toBe(4);
      component.addNewLink();
      fixture.detectChanges();
      expect(component.dropdown.options.length).toBe(5);
    });
  });
});

import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IconCollectionModule } from 'sbb-angular-icons';

import { dispatchEvent } from '../../_common/testing/dispatch-events';
import { createMouseEvent } from '../../_common/testing/event-objects';
import { ButtonModule } from '../../button/button';
import { NavigationPageDescriptor } from '../navigation-page-descriptor.model';
import { NavigationComponent } from '../navigation/navigation.component';
import { LinkGeneratorResult } from '../page-descriptor.model';
import { PaginationModule } from '../pagination.module';

import { PaginationComponent } from './pagination.component';

@Component({
  selector: 'sbb-pagination-test',
  template: `<sbb-pagination #pagination
    (pageChange)="onPageChange($event)"
    [maxPage]="maxPage"
    [initialPage]="initialPage"></sbb-pagination>
    `
})
export class PaginationTestComponent {

  maxPage = 5;
  initialPage = 1;

  @ViewChild('pagination') pagination: PaginationComponent;

  onPageChange($event) {

  }

}

@Component({
  selector: 'sbb-pagination-link-test',
  template: ` <sbb-pagination #paginationLink
    (pageChange)="onPageChange($event)"
    [maxPage]="maxPage"
    [linkGenerator]="linkGenerator"></sbb-pagination>
    `
})
export class PaginationLinkTestComponent {

  maxPage = 10;
  @ViewChild('paginationLink') paginationLink: PaginationComponent;
  private _route: ActivatedRoute;

  linkGenerator = (page: { displayNumber: number, index: number }): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { page: page.displayNumber },
      queryParamsHandling: 'merge',
      relativeTo: this._route,
    };
  }

  onPageChange($event) {

  }
}

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, CommonModule, RouterTestingModule],
      declarations: [PaginationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.maxPage = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('PaginationComponent behaviour', () => {
  let component: PaginationTestComponent;
  let fixture: ComponentFixture<PaginationTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PaginationModule, RouterTestingModule],
      declarations: [PaginationTestComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationTestComponent);
    component = fixture.componentInstance;
    component.maxPage = 10;
    component.initialPage = 5;
    fixture.detectChanges();
  });

  describe('with more than 5 pages', () => {
    describe('ellipsis', () => {
      it('should show one ellipsis with first,second and third page selected', () => {
        component.maxPage = 10;
        component.initialPage = 1;
        fixture.detectChanges();
        let ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 2;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 3;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 4;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(2);
      });

      it('should show one ellipsis with last, last -1 and last-2 page selected', () => {
        component.maxPage = 10;
        component.initialPage = 10;
        fixture.detectChanges();
        let ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 9;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 8;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 7;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(2);
      });
    });

  });

  describe('when clicking on the left arrow', () => {
    it('should go to the next page', () => {
      component.maxPage = 10;
      component.initialPage = 5;
      fixture.detectChanges();
      const pageNumbers = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));
      dispatchEvent(pageNumbers[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();
      expect(component.pagination.initialPage).toBe(6);
    });

  });

  describe('when clicking on the right arrow', () => {
    it('should go to the previous page', () => {
      component.maxPage = 10;
      component.initialPage = 5;
      fixture.detectChanges();
      const pageNumbers = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));
      dispatchEvent(pageNumbers[0].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();
      expect(component.pagination.initialPage).toBe(4);
    });
  });

});

describe('Pagination as links behaviour ', () => {

  let component: PaginationLinkTestComponent;
  let fixture: ComponentFixture<PaginationLinkTestComponent>;
  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PaginationModule, RouterTestingModule],
      declarations: [PaginationLinkTestComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(PaginationLinkTestComponent);
    component = fixture.componentInstance;
    component.maxPage = 10;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('when clicking on the right arrow', async(() => {
    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);
      const arrowPage = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));

      router.navigate(['.'], { queryParams: { page: 1 } });
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      expect(location.path()).toContain('?page=3');
    });
  }));

  it('when clicking on the left arrow', async(() => {
    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);
      fixture.detectChanges();

      await fixture.whenStable();
      // Initially, the focus is on first page.
      const arrowPage = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage[0].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      expect(location.path()).toContain('?page=2');
    });
  }));

  it('it controls the initial number of page ', () => {

    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);
      fixture.detectChanges();

      await fixture.whenStable();
      const itemSelected = fixture.debugElement.query(By.css('ng-star-inserted.sbb-pagination-item-selected'));
      expect(itemSelected).toContain('1');

    });

  });

  it('it controls the number of page after the navigation to next pages ', () => {

    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);
      fixture.detectChanges();

      await fixture.whenStable();
      const arrowPage = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      const itemSelected = fixture.debugElement.query(By.css('ng-star-inserted.sbb-pagination-item-selected'));
      expect(itemSelected).toContain('3');

    });

  });

  it('it controls the number of page after the navigation to previous pages ', () => {

    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);
      fixture.detectChanges();

      await fixture.whenStable();
      const arrowPage = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage[0].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      const itemSelected = fixture.debugElement.query(By.css('ng-star-inserted.sbb-pagination-item-selected'));
      expect(itemSelected).toContain('2');

    });

  });

  it('it controls if the initial state has the left arrow disabled ', () => {

    const arrowPage = fixture.debugElement.query(By.css('.sbb-pagination-item-boundary.sbb-pagination-item-disabled'));
    expect(arrowPage).toBeDefined();

  });

  it('it controls if aria-current is active on current page selected ', () => {

    fixture.ngZone.run(async () => {

      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);
      fixture.detectChanges();

      await fixture.whenStable();
      const itemSelected = fixture.debugElement
        .query(By.css('ng-star-inserted.sbb-pagination-item-selected')).nativeElement;

      expect(itemSelected).toContain('1');
      expect(itemSelected.attributes['aria-current']).toBeTruthy();
      expect(itemSelected.attributes['aria-current'].value).toBe('true');
    });

  });

});

@Component({
  selector: 'sbb-navigation-test',
  template: `<sbb-navigation #navigation
    (pageChange)="onPageChangeNavigation($event)"
    [nextPage]="nextPage"
    [previousPage]="previousPage"></sbb-navigation>
    <input type="text" name="newPage" [(ngModel)]="newPage.title">
    <button id="new-page-button" sbbButton (click)="addPage()">Add new page</button>
    `
})
export class NavigationTestComponent {

  @ViewChild('navigation') navigation: NavigationComponent;

  newPage = { title: 'paginaTest' };

  pages = [
    'Einführung',
    'Kapitel 1',
    'Kapitel 2',
    'Kapitel 3'
  ].map((page, index) => {
    return { title: page, index: index };
  });

  hasPrevious: NavigationPageDescriptor = this.pages[1];
  hasNext: NavigationPageDescriptor = this.pages[2];

  get previousPage(): string { return this.hasPrevious ? this.hasPrevious.title : null; }
  get nextPage(): string { return this.hasNext ? this.hasNext.title : null; }

  onPageChangeNavigation($event) {
    if ($event === 'next') {
      this.hasPrevious = this.hasNext;
      this.hasNext = this.pages[this.hasNext.index + 1];
    } else {
      this.hasNext = this.hasPrevious;
      this.hasPrevious = this.pages[this.hasPrevious.index - 1];
    }
  }

  addPage() {
    this.pages.push({ title: this.newPage.title, index: this.pages.length });
    this.newPage.title = '';
  }

}

@Component({
  selector: 'sbb-navigation-link-test',
  template: `<sbb-navigation #navigationLink
    [linkGenerator]="linkGeneratorNavigation"
    (pageChange)="onPageChangeNavigation($event)"
    [nextPage]="nextPage"
    [previousPage]="previousPage"></sbb-navigation>
    <input type="text" name="newPage" [(ngModel)]="newPage.title">
    <button id="new-page-button" sbbButton (click)="addPage()">Add new page</button>
  `
})
export class NavigationLinkTestComponent {

  @ViewChild('navigationLink') navigationLink: NavigationComponent;

  pages = [
    'Einführung',
    'Kapitel 1',
    'Kapitel 2',
    'Kapitel 3'
  ].map((page, index) => {
    return { title: page, index: index };
  });

  newPage = { title: 'paginaTest' };

  hasPrevious: NavigationPageDescriptor = this.pages[1];
  hasNext: NavigationPageDescriptor = this.pages[2];

  constructor(private _route: ActivatedRoute) { }

  get previousPage(): string { return this.hasPrevious ? this.hasPrevious.title : null; }
  get nextPage(): string { return this.hasNext ? this.hasNext.title : null; }

  linkGeneratorNavigation = (direction: 'previous' | 'next'): LinkGeneratorResult => {
    let index = null;

    if (direction === 'next') {
      index = this.hasNext.index;
    } else {
      index = this.hasPrevious.index;
    }

    return {
      routerLink: ['.'],
      queryParams: { page: index },
      queryParamsHandling: 'merge',
      relativeTo: this._route,
    };
  }

  onPageChangeNavigation($event) {
    if ($event === 'next') {
      this.hasPrevious = this.hasNext;
      this.hasNext = this.pages[this.hasNext.index + 1];
    } else {
      this.hasNext = this.hasPrevious;
      this.hasPrevious = this.pages[this.hasPrevious.index - 1];
    }
  }

  addPage() {
    this.pages.push({ title: this.newPage.title, index: this.pages.length });
    this.newPage.title = '';
  }

}

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, CommonModule, RouterTestingModule],
      declarations: [NavigationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('NavigationComponent behaviour', () => {
  let component: NavigationTestComponent;
  let fixture: ComponentFixture<NavigationTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PaginationModule, RouterTestingModule, ButtonModule, FormsModule],
      declarations: [NavigationTestComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTestComponent);
    component = fixture.componentInstance;
  });

  it('it verifies the initial state of the navigation buttons', () => {

    fixture.detectChanges();

    const buttonsReference = fixture.debugElement.queryAll(By.css('.sbb-navigation-item > button'));
    const previousButton = buttonsReference[0].nativeElement;
    const nextButton = buttonsReference[1].nativeElement;

    expect(previousButton.attributes['title']).toBeTruthy();
    expect(previousButton.attributes['title'].value).toBe('Kapitel 1');
    expect(nextButton.attributes['title']).toBeTruthy();
    expect(nextButton.attributes['title'].value).toBe('Kapitel 2');

  });

  it('it verifies the click to next chapter', () => {

    fixture.detectChanges();
    const buttonsReference = fixture.debugElement.queryAll(By.css('.sbb-navigation-item > button'));
    const nextButton = buttonsReference[1].nativeElement;
    nextButton.click();
    fixture.detectChanges();

    expect(nextButton.attributes['title'].value).toBe('Kapitel 3');

  });

  it('it verifies the click to previous chapter', () => {

    fixture.detectChanges();
    const buttonsReference = fixture.debugElement.queryAll(By.css('.sbb-navigation-item > button'));
    const nextButton = buttonsReference[0].nativeElement;
    nextButton.click();
    fixture.detectChanges();

    expect(nextButton.attributes['title'].value).toBe('Einführung');

  });

  it('it verifies the adding of new page', () => {

    const buttonAddPage = fixture.debugElement.query(By.css('#new-page-button')).nativeElement;
    buttonAddPage.click();
    fixture.detectChanges();

    expect(component.pages.length).toBe(5);
  });

  it('it verifies the navigation to new page', () => {

    const buttonAddPage = fixture.debugElement.query(By.css('#new-page-button')).nativeElement;
    buttonAddPage.click();
    fixture.detectChanges();

    expect(component.pages.length).toBe(5);

    const buttonsReference = fixture.debugElement.queryAll(By.css('.sbb-navigation-item > button'));
    const nextButton = buttonsReference[1].nativeElement;
    nextButton.click();
    fixture.detectChanges();
    nextButton.click();
    fixture.detectChanges();

    expect(nextButton.attributes['title'].value).toBe('paginaTest');

  });

});

describe('Navigation as links behaviour ', () => {

  let component: NavigationLinkTestComponent;
  let fixture: ComponentFixture<NavigationLinkTestComponent>;
  let location: Location = null;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PaginationModule,
        RouterTestingModule, ButtonModule, FormsModule],
      declarations: [NavigationLinkTestComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NavigationLinkTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('it controls the initial state of link chapters', () => {

    const linkReferenceLeft = fixture.debugElement
      .query(By.css('.sbb-navigation-item.sbb-navigation-item-left > a')).nativeElement;
    const linkReferenceRight = fixture.debugElement
      .query(By.css('.sbb-navigation-item.sbb-navigation-item-right > a')).nativeElement;

    expect(linkReferenceLeft.attributes['title'].value).toBe('Kapitel 1');
    expect(linkReferenceRight.attributes['title'].value).toBe('Kapitel 2');

  });

  it('it moves with the right arrow', async(() => {
    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { index: 2 } });
      fixture.detectChanges();

      await fixture.whenStable();
      const linkReferenceRight = fixture.debugElement
        .query(By.css('.sbb-navigation-item.sbb-navigation-item-right > a')).nativeElement;
      dispatchEvent(linkReferenceRight, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(linkReferenceRight.attributes['title'].value).toBe('Kapitel 3');

    });
  }));

  it('it moves with left arrow', () => {

    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { index: 2 } });
      fixture.detectChanges();

      await fixture.whenStable();
      const linkReferenceLeft = fixture.debugElement
        .query(By.css('.sbb-navigation-item.sbb-navigation-item-left > a')).nativeElement;
      dispatchEvent(linkReferenceLeft, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(linkReferenceLeft.attributes['title'].value).toBe('Einführung');
    });

  });

  it('it verifies the adding of a new page', () => {

    const buttonAddPage = fixture.debugElement.query(By.css('#new-page-button')).nativeElement;
    buttonAddPage.click();
    fixture.detectChanges();

    expect(component.pages.length).toBe(5);

    fixture.ngZone.run(async () => {
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.detectChanges();
      location = TestBed.get(Location);

      router.navigate(['.'], { queryParams: { index: 2 } });
      fixture.detectChanges();

      await fixture.whenStable();
      const arrowPage = fixture.debugElement
        .query(By.css('.sbb-navigation-item.sbb-navigation-item-right > a')).nativeElement;
      dispatchEvent(arrowPage, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      dispatchEvent(arrowPage, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      const linkReferenceRight = fixture.debugElement
        .query(By.css('.sbb-navigation-item.sbb-navigation-item-right > a')).nativeElement;

      expect(linkReferenceRight.attributes['title'].value).toBe('provaTest');

    });

  });
});

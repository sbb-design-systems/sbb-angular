import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { ButtonModule } from '@sbb-esta/angular-public/button';

import { PaginationModule } from '../pagination.module';

import { NavigationComponent, NavigationPageChangeEvent } from './navigation.component';

@Component({
  selector: 'sbb-navigation-test',
  template: `
    <sbb-navigation
      #navigation
      (pageChange)="onPageChangeNavigation($event)"
      [nextPage]="nextPage"
      [previousPage]="previousPage"
    ></sbb-navigation>
    <input type="text" name="newPage" [(ngModel)]="newPage.title" />
    <button id="new-page-button" sbbButton (click)="addPage()">
      Add new page
    </button>
  `
})
export class NavigationTestComponent {
  @ViewChild('navigation', { static: true }) navigation: NavigationComponent;

  newPage = { title: 'paginaTest' };

  pages = ['Einführung', 'Kapitel 1', 'Kapitel 2', 'Kapitel 3'].map((page, index) => {
    return { title: page, index: index };
  });

  hasPrevious = this.pages[1];
  hasNext = this.pages[2];

  get previousPage(): string | null {
    return this.hasPrevious ? this.hasPrevious.title : null;
  }
  get nextPage(): string | null {
    return this.hasNext ? this.hasNext.title : null;
  }

  onPageChangeNavigation($event: NavigationPageChangeEvent) {
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
    }).compileComponents();
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
      declarations: [NavigationTestComponent]
    }).compileComponents();
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

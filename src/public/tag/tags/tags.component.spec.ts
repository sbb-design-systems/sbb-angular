import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SbbCheckboxChange as TagChange } from '@sbb-esta/angular-core/base';
import { BadgeModule } from '@sbb-esta/angular-public/badge';

import { Tag } from '../tag.model';
import { TagComponent } from '../tag/tag.component';

import { TagsComponent } from './tags.component';

@Component({
  selector: 'sbb-tags-test-fixture',
  template: `
    <sbb-tags>
      <ng-container *ngFor="let tag of tagItems">
        <sbb-tag
          [(ngModel)]="tag.selected"
          (change)="change($event)"
          [label]="tag.label"
          [id]="tag.id"
          [amount]="tag.amount"
        ></sbb-tag>
      </ng-container>
    </sbb-tags>
  `
})
class TagsTestFixtureComponent {
  tagItems: Tag[] = [
    {
      id: 'tag-1',
      label: 'Services',
      amount: 8,
      selected: false
    },
    {
      label: 'Restaurants / Take Away',
      amount: 9,
      selected: false
    }
  ];

  change(evt: TagChange) {}
}

@Component({
  selector: 'sbb-taglink-test-fixture',
  template: `
    <a href="#">
      <sbb-tag label="Link tag" amount="5"></sbb-tag>
    </a>
  `
})
class TagLinkTestFixtureComponent {}

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BadgeModule],
      declarations: [TagsComponent, TagComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a all tag instantiated', () => {
    expect(component.allTag).toBeTruthy();
  });
});

describe('TagsComponent with Model attached', () => {
  let component: TagsTestFixtureComponent;
  let fixture: ComponentFixture<TagsTestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, BadgeModule],
      declarations: [TagsComponent, TagComponent, TagsTestFixtureComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsTestFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have three sbb-tag instantiated', () => {
    const tags = fixture.debugElement.queryAll(By.directive(TagComponent));

    expect(tags.length).toBe(3);
  });

  it('should the second sbb-tag input have the ID set by the Model', () => {
    const secondTag: TagComponent = fixture.debugElement.queryAll(By.directive(TagComponent))[1]
      .componentInstance;

    expect(secondTag.id).toBe('tag-1');
  });

  it('should the third sbb-tag input have an auto generated ID', () => {
    const thirdTag: TagComponent = fixture.debugElement.queryAll(By.directive(TagComponent))[2]
      .componentInstance;

    expect(thirdTag.inputId).toMatch(/sbb-tag-\d+-input/);
  });

  it('should have all its sbb-tag children with linkMode set to false', () => {
    const tags = fixture.debugElement.queryAll(By.directive(TagComponent));

    const foundLinkModes = tags.findIndex(tag => tag.componentInstance.linkMode === true) !== -1;

    expect(foundLinkModes).toBeFalsy();
  });

  it('should set an amount', () => {
    const tags = fixture.debugElement.queryAll(By.directive(TagComponent));

    tags.forEach(tag => {
      const tagAmount = tag.componentInstance.amount;
      expect(tagAmount).toBeDefined();
      expect(tagAmount).not.toBeNaN();
    });
  });

  it('should check when click the label', () => {
    const tag = fixture.debugElement.queryAll(By.directive(TagComponent))[1];
    const tagLabel = tag.query(By.css('label'));

    tagLabel.nativeElement.click();

    const tagChecked = tag.queryAll(By.css('input:checked'));

    expect(tagChecked.length).toBe(1);
  });

  it('should sbb-tag to be checked if model is true and update Model if checked/unchecked', async () => {
    const tag = fixture.debugElement.queryAll(By.directive(TagComponent))[1];
    const tagLabel = tag.query(By.css('label'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(tag.componentInstance.checked).toBe(false);

    component.tagItems[0].selected = true;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(tag.componentInstance.checked).toBe(true);
    expect(component.tagItems[0].selected).toBe(true);

    tagLabel.nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(tag.componentInstance.checked).toBe(false);
    expect(component.tagItems[0].selected).toBe(false);
  });

  it('should the allTag be inactive with at least one tag selected and vice versa', async () => {
    const tags = fixture.debugElement.queryAll(By.directive(TagComponent));
    const allTag = tags[0];
    const firstTag = tags[1];

    fixture.detectChanges();
    await fixture.whenStable();

    firstTag.query(By.css('label')).nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(allTag.componentInstance.checked).toBe(false);
    expect(allTag.componentInstance.active).toBe(false);

    allTag.query(By.css('label')).nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(allTag.componentInstance.checked).toBe(true);
    expect(allTag.componentInstance.active).toBe(true);
  });

  it('should when clicking the allTag all other tags to be unchecked/false', async () => {
    const tags = fixture.debugElement.queryAll(By.directive(TagComponent));
    const allTag = tags[0];

    allTag.query(By.css('label')).nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    tags.splice(0, 1);

    const hasTruthyValues =
      tags.findIndex(t => t.componentInstance.checked && t.componentInstance.active) !== -1;

    expect(hasTruthyValues).toBeFalsy();
  });

  it('should call the change event when checking/unchecking a sbb-tag', () => {
    const firstTag = fixture.debugElement.queryAll(By.directive(TagComponent))[1];

    spyOn(component, 'change');

    firstTag.query(By.css('label')).nativeElement.click();

    fixture.detectChanges();

    expect(component.change).toHaveBeenCalled();
  });
});

describe('TagComponent as a Link Tag', () => {
  let fixture: ComponentFixture<TagLinkTestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BadgeModule],
      declarations: [TagComponent, TagLinkTestFixtureComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagLinkTestFixtureComponent);
    fixture.detectChanges();
  });

  it('should have linkMode set to true', () => {
    const linkTag = fixture.debugElement.query(By.directive(TagComponent));

    expect(linkTag.componentInstance.linkMode).toBe(true);
  });

  it('should be active', () => {
    const linkTag = fixture.debugElement.query(By.directive(TagComponent));

    expect(linkTag.componentInstance.active).toBe(true);
  });
});

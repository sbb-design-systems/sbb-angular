import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsComponent } from './tags.component';
import { TagComponent } from '../tag/tag.component';
import { Component } from '@angular/core';
import { Tag, TagChange } from '../tag.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'sbb-tags-test-fixture',
  template: `<sbb-tags>
              <ng-container *ngFor="let tag of tagItems">
                <sbb-tag [(ngModel)]="tag.selected"
                        (tagChange)="change($event)"
                        [label]="tag.label"
                        [id]="tag.id"
                        [amount]="tag.amount"></sbb-tag>
              </ng-container>
            </sbb-tags>`
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

  change(change: TagChange) { }
}

@Component({
  selector: 'sbb-taglink-test-fixture',
  template: `<a href="#">
              <sbb-tag label="Link tag" amount="5"></sbb-tag>
            </a>`
})
class TagLinkTestFixtureComponent {
}

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsComponent, TagComponent]
    })
      .compileComponents();
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
      imports: [CommonModule, FormsModule],
      declarations: [TagsComponent, TagComponent, TagsTestFixtureComponent]
    })
      .compileComponents();
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
    const secondTag: TagComponent = fixture.debugElement.queryAll(By.directive(TagComponent))[1].componentInstance;

    expect(secondTag.inputId).toBe('tag-1');
  });

  it('should the third sbb-tag input have an auto generated ID', () => {
    const thirdTag: TagComponent = fixture.debugElement.queryAll(By.directive(TagComponent))[2].componentInstance;

    expect(thirdTag.inputId).toBe('sbb-tag-2');
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

    expect(tag.componentInstance._checked).toBe(false);

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

  it('should the allTag inactive with at least one tag selected and active with no tags selected', () => {
  });

  it('should when clicking the allTag set all other tags to unchecked/false', () => {
  });

  it('should call the tagChange event when checking/unchecking a sbb-tag', () => {
  });

});

describe('TagComponent as a Link Tag', () => {
  let component: TagLinkTestFixtureComponent;
  let fixture: ComponentFixture<TagLinkTestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagComponent, TagLinkTestFixtureComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagLinkTestFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have linkMode set to true', () => {
  });

  it('should have an active like appearance', () => {
  });
});

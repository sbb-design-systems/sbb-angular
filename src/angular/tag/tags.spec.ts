import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SbbBadge, SbbBadgeModule } from '@sbb-esta/angular/badge';
import { SbbCheckboxChange as SbbTagChange } from '@sbb-esta/angular/checkbox';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbTag } from './tag';
import { SbbTagModule } from './tag.module';
import { SbbTags } from './tags';

interface Tag {
  /** Identifier of a tag. */
  id?: string;
  /** Label of a tag. */
  label: string;
  /** Amount of results of a tag. */
  amount: number;
  /** Refers if a tag is selected. */
  selected?: boolean;
}

@Component({
  template: `
    <sbb-tags>
      @for (tag of tagItems; track tag) {
        <sbb-tag
          [(ngModel)]="tag.selected"
          (change)="change($event)"
          [id]="tag.id"
          [amount]="tag.amount"
          [sbbBadgeDescription]="description"
          >{{ tag.label }}</sbb-tag
        >
      }
    </sbb-tags>
  `,
  standalone: true,
  imports: [FormsModule, SbbBadgeModule, SbbTagModule],
})
class TagsTestFixtureComponent {
  tagItems: Tag[] = [
    {
      id: 'tag-1',
      label: 'Services',
      amount: 8,
      selected: false,
    },
    {
      label: 'Restaurants / Take Away',
      amount: 9,
      selected: false,
    },
  ];
  description?: string;

  change(evt: SbbTagChange) {}
}

@Component({
  template: `
    <ng-container [formGroup]="formGroup">
      <sbb-tags [totalAmount]="totalAmount">
        @for (tag of tagItems; track tag) {
          <sbb-tag
            [formControlName]="tag.id"
            (change)="change($event)"
            [id]="tag.id"
            [amount]="tag.amount"
            >{{ tag.label }}</sbb-tag
          >
        }
      </sbb-tags>
    </ng-container>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, SbbBadgeModule, SbbTagModule],
})
class TagsTestFixtureReactiveComponent {
  formGroup = new FormGroup({
    services: new FormControl(false),
    restaurants: new FormControl(false),
    onemore: new FormControl(false),
  });
  tagItems: Tag[] = [
    {
      id: 'services',
      label: 'Services',
      amount: 8,
    },
    {
      id: 'restaurants',
      label: 'Restaurants / Take Away',
      amount: 9,
    },
  ];
  totalAmount: number;

  change(evt: SbbTagChange) {}
}

@Component({
  template: ` <a sbb-tag-link href="#" amount="5" [sbbBadgeDescription]="description">Trains</a> `,
  standalone: true,
  imports: [SbbBadgeModule, SbbTagModule],
})
class TagLinkTestFixtureComponent {
  description?: string;
}

@Component({
  template: `
    <sbb-tags>
      <sbb-tag [amount]="9" svgIcon="cutlery-small" class="restaurants-tag"></sbb-tag>
    </sbb-tags>

    <a sbb-tag-link href="#" amount="5" svgIcon="train-small" class="trains-tag-link">Trains</a>
  `,
  standalone: true,
  imports: [SbbBadgeModule, SbbTagModule, SbbIconTestingModule],
})
class TagWithIconTextTestFixtureComponent {}

describe('SbbTags', () => {
  describe('SbbTags plain', () => {
    let component: SbbTags;
    let fixture: ComponentFixture<SbbTags>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SbbTags);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have a "All" tag instantiated', () => {
      expect(component.allTag).toBeTruthy();
    });
  });

  describe('SbbTags with Model attached', () => {
    let component: TagsTestFixtureComponent;
    let fixture: ComponentFixture<TagsTestFixtureComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TagsTestFixtureComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have three sbb-tag instantiated', () => {
      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));

      expect(tags.length).toBe(3);
    });

    it('should the second sbb-tag input have the ID set by the Model', () => {
      const secondTag: SbbTag = fixture.debugElement.queryAll(By.directive(SbbTag))[1]
        .componentInstance;

      expect(secondTag.id).toBe('tag-1');
    });

    it('should the third sbb-tag input have an auto generated ID', () => {
      const thirdTag: SbbTag = fixture.debugElement.queryAll(By.directive(SbbTag))[2]
        .componentInstance;

      expect(thirdTag.inputId).toMatch(/sbb-checkbox-\w+\d+-input/);
    });

    it('should set an amount', () => {
      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));

      tags.forEach((tag) => {
        const tagAmount = tag.componentInstance.amount;
        expect(tagAmount).toBeDefined();
        expect(tagAmount).not.toBeNaN();
      });
    });

    it('should calculate the total amount', () => {
      expectTotalAmount(17, fixture);

      component.tagItems.push({ amount: 3, label: 'one more', selected: false });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expectTotalAmount(20, fixture);
    });

    it('should calculate the total amount after a child has changed its amount', () => {
      expectTotalAmount(17, fixture);

      component.tagItems[0].amount = 6;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expectTotalAmount(15, fixture);
    });

    it('should calculate the total amount after a later added child has changed its amount', () => {
      expectTotalAmount(17, fixture);

      component.tagItems.push({ amount: 5, label: 'laterAdded' });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      component.tagItems[component.tagItems.length - 1].amount = 6;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expectTotalAmount(23, fixture);
    });

    it('should set the total amount to zero after every tag was removed', () => {
      expectTotalAmount(17, fixture);

      component.tagItems = [];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expectTotalAmount(0, fixture);
    });

    it('should check when click the label', () => {
      const tag = fixture.debugElement.queryAll(By.directive(SbbTag))[1];
      const tagLabel = tag.query(By.css('label'));

      tagLabel.nativeElement.click();

      const tagChecked = tag.queryAll(By.css('input:checked'));

      expect(tagChecked.length).toBe(1);
    });

    it('should sbb-tag to be checked if model is true and update Model if checked/unchecked', async () => {
      const tag = fixture.debugElement.queryAll(By.directive(SbbTag))[1];
      const tagLabel = tag.query(By.css('label'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(tag.componentInstance.checked).toBe(false);

      component.tagItems[0].selected = true;

      fixture.changeDetectorRef.markForCheck();
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

    it('should update all models when clicking "All" tag', async () => {
      spyOn(component, 'change');

      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));
      const allTag = tags[0];
      const firstTag = tags[1];
      const secondTag = tags[2];

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(secondTag.componentInstance.checked).toBe(false);

      component.tagItems[0].selected = true;

      fixture.detectChanges();
      await fixture.whenStable();

      allTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.change).toHaveBeenCalledTimes(1);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(secondTag.componentInstance.checked).toBe(false);
      expect(component.tagItems[0].selected).toBe(false);
      expect(component.tagItems[1].selected).toBe(false);

      // should still trigger no changeEvent if clicking a second time on allTag
      allTag.query(By.css('label')).nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.change).toHaveBeenCalledTimes(1);
    });

    it('should the "All" tag be inactive with at least one tag selected and vice versa', async () => {
      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));
      const allTag = tags[0];
      const firstTag = tags[1];

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);
      expect(allTag.componentInstance.active).toBe(true);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(firstTag.componentInstance.active).toBe(false);

      firstTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(false);
      expect(allTag.componentInstance.active).toBe(false);
      expect(firstTag.componentInstance.checked).toBe(true);
      expect(firstTag.componentInstance.active).toBe(true);

      allTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);
      expect(allTag.componentInstance.active).toBe(true);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(firstTag.componentInstance.active).toBe(false);
    });

    it('should prevent uncheck the "All" tag at the same time when all other tags are unchecked', async () => {
      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));
      const allTag = tags[0];
      const firstTag = tags[1];

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);
      expect(allTag.componentInstance.active).toBe(true);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(firstTag.componentInstance.active).toBe(false);

      allTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);
      expect(allTag.componentInstance.active).toBe(true);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(firstTag.componentInstance.active).toBe(false);
    });

    it('should when clicking the "All" tag all other tags to be unchecked/false', async () => {
      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));
      const allTag = tags[0];

      allTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      tags.splice(0, 1);

      const hasTruthyValues =
        tags.findIndex((t) => t.componentInstance.checked && t.componentInstance.active) !== -1;

      expect(hasTruthyValues).toBeFalsy();
    });

    it('should call the change event when checking/unchecking a sbb-tag', () => {
      const firstTag = fixture.debugElement.queryAll(By.directive(SbbTag))[1];

      spyOn(component, 'change');

      firstTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();

      expect(component.change).toHaveBeenCalled();
    });

    it('should update "All" tag when model of a child sbb-tag is updated', async () => {
      const allTag = fixture.debugElement.queryAll(By.directive(SbbTag))[0];

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);

      component.tagItems[0].selected = true;

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(false);
    });

    it('should have default badge description for "All" tag', () => {
      expect(extractBadgeDescription(fixture.debugElement)).toBe('A total of 17 results available');
    });

    it('should have default badge description for first tag', () => {
      expect(extractBadgeDescription(fixture.debugElement.queryAll(By.directive(SbbTag))[1])).toBe(
        '8 results available',
      );
    });

    it('should have custom badge description for first tag', () => {
      fixture.componentInstance.description = 'description';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(extractBadgeDescription(fixture.debugElement.queryAll(By.directive(SbbTag))[1])).toBe(
        'description',
      );
    });
  });

  describe('SbbTags with Reactive Forms and total amount set as input', () => {
    let component: TagsTestFixtureReactiveComponent;
    let fixture: ComponentFixture<TagsTestFixtureReactiveComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TagsTestFixtureReactiveComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have three sbb-tag instantiated', () => {
      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));

      expect(tags.length).toBe(3);
    });

    it('should take totalAmount of input', () => {
      component.totalAmount = 100;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expectTotalAmount(100, fixture);
      component.formGroup.addControl('onemore', new FormControl(false));
      component.tagItems.push({ id: 'onemore', amount: 3, label: 'one more' });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expectTotalAmount(100, fixture);
    });

    it('should check when click the label', () => {
      const tag = fixture.debugElement.queryAll(By.directive(SbbTag))[1];
      const tagLabel = tag.query(By.css('label'));

      tagLabel.nativeElement.click();

      const tagChecked = tag.queryAll(By.css('input:checked'));

      expect(tagChecked.length).toBe(1);
    });

    it('should sbb-tag to be checked if model is true and update Model if checked/unchecked', async () => {
      const tag = fixture.debugElement.queryAll(By.directive(SbbTag))[1];
      const tagLabel = tag.query(By.css('label'));
      expect(tag.componentInstance.checked).toBe(false);

      component.formGroup.patchValue({ services: true });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(tag.componentInstance.checked).toBe(true);
      expect(component.formGroup.get('services')!.value).toBe(true);

      tagLabel.nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(tag.componentInstance.checked).toBe(false);
      expect(component.formGroup.get('services')!.value).toBe(false);
    });

    it('should update all models when clicking "All" tag', async () => {
      spyOn(component, 'change');

      const tags = fixture.debugElement.queryAll(By.directive(SbbTag));
      const allTag = tags[0];
      const firstTag = tags[1];
      const secondTag = tags[2];

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(secondTag.componentInstance.checked).toBe(false);

      component.formGroup.patchValue({ services: true });

      fixture.detectChanges();
      await fixture.whenStable();

      allTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.change).toHaveBeenCalledTimes(1);
      expect(firstTag.componentInstance.checked).toBe(false);
      expect(secondTag.componentInstance.checked).toBe(false);
      expect(component.formGroup.get('services')!.value).toBe(false);
      expect(component.formGroup.get('restaurants')!.value).toBe(false);

      // should still trigger no changeEvent if clicking a second time on allTag
      allTag.query(By.css('label')).nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.change).toHaveBeenCalledTimes(1);
    });

    it('should call the change event when checking/unchecking a sbb-tag', () => {
      const firstTag = fixture.debugElement.queryAll(By.directive(SbbTag))[1];

      spyOn(component, 'change');

      firstTag.query(By.css('label')).nativeElement.click();

      fixture.detectChanges();

      expect(component.change).toHaveBeenCalled();
    });

    it('should update allTag when model of a child sbb-tag is updated', async () => {
      const allTag = fixture.debugElement.queryAll(By.directive(SbbTag))[0];

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(true);

      component.formGroup.patchValue({ services: true });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(allTag.componentInstance.checked).toBe(false);
    });
  });
});

describe('SBB Tag Link', () => {
  let fixture: ComponentFixture<TagLinkTestFixtureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TagLinkTestFixtureComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagLinkTestFixtureComponent);
    fixture.detectChanges();
  });

  it('should have default badgeDescription', () => {
    expect(extractBadgeDescription(fixture.debugElement)).toEqual('5 results available');
  });

  it('should have badge with amount and description', () => {
    fixture.componentInstance.description = 'amount';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const linkTag = fixture.debugElement.query(By.css('.sbb-tag-link'));
    expect(linkTag.nativeElement.textContent).toEqual('Trains5');
    expect(extractBadgeDescription(fixture.debugElement)).toEqual('amount');
  });
});

describe('SBB Tag with Icon', () => {
  let fixture: ComponentFixture<TagWithIconTextTestFixtureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TagWithIconTextTestFixtureComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagWithIconTextTestFixtureComponent);
    fixture.detectChanges();
  });

  it('should have a svgIcon', () => {
    const tags = fixture.debugElement.queryAll(By.directive(SbbTag));
    expect(tags[1].componentInstance.svgIcon).toBe('cutlery-small');

    const links = fixture.debugElement.queryAll(By.css('a.sbb-tag-link'));
    expect(links[0].componentInstance.svgIcon).toBe('train-small');
  });
});

function expectTotalAmount(expectedTotalAmount: number, fixture: any) {
  const tagsComponent: SbbTags = fixture.debugElement.query(
    By.directive(SbbTags),
  ).componentInstance;
  expect(tagsComponent.totalAmount).toBe(expectedTotalAmount);

  const allTag = fixture.debugElement.query(By.directive(SbbTag));
  const sbbBadge = allTag.query(By.directive(SbbBadge)).nativeElement;
  expect(sbbBadge.textContent).toBe(expectedTotalAmount.toString(10));
}

function extractBadgeDescription(sbbTag: DebugElement) {
  const ariaDescribedById = sbbTag
    .query(By.css('.sbb-badge'))
    .nativeElement.getAttribute('aria-describedby');
  return document.getElementById(ariaDescribedById)!.textContent;
}

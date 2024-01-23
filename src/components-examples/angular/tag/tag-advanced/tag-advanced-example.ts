import { JsonPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTagChange } from '@sbb-esta/angular/tag';
import { SbbTagModule } from '@sbb-esta/angular/tag';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Tag {
  /** Label of a tag. */
  label: string;
  /** Amount of results of a tag. */
  amount: number;
}

const tagItems: Tag[] = [
  {
    label: 'Services',
    amount: 8,
  },
  {
    label: 'Restaurants / Take Away',
    amount: 9,
  },
  {
    label: 'Flowers',
    amount: 10,
  },
  {
    label: 'Electronic / Music / Photo',
    amount: 11,
  },
];

/**
 * @title Tag Advanced
 * @order 30
 */
@Component({
  selector: 'sbb-tag-advanced-example',
  templateUrl: 'tag-advanced-example.html',
  standalone: true,
  imports: [
    SbbTagModule,
    SbbButtonModule,
    SbbFormFieldModule,
    FormsModule,
    SbbInputModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
})
export class TagAdvancedExample implements OnDestroy {
  tags: Tag[];

  amountFirstItem = new FormControl<number>(0, { initialValueIsDefault: true });
  private _destroyed = new Subject<void>();

  constructor() {
    this.reset();
    this.amountFirstItem.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((amount) => this.tags.length > 0 && (this.tags[0].amount = amount));
  }

  addOneItem() {
    this.tags.push({
      label: 'New Item',
      amount: this.tags.length === 0 ? this.amountFirstItem.value : 20,
    });
  }

  removeOneItem() {
    this.tags.pop();
    this.amountFirstItem.setValue(this.tags[0].amount);
  }

  reset() {
    this.tags = JSON.parse(JSON.stringify(tagItems)); // Create a deep copy for example purposes
    this.amountFirstItem.setValue(this.tags[0].amount);
  }

  change(evt: SbbTagChange) {
    console.log(evt);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}

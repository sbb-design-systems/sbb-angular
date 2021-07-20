import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbTagChange } from '@sbb-esta/angular-public/tag';
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

@Component({
  selector: 'sbb-tag-advanced-example',
  templateUrl: './tag-advanced-example.component.html',
})
export class TagAdvancedExampleComponent implements OnDestroy {
  tags: Tag[];

  amountFirstItem = new FormControl();
  private _destroyed = new Subject();

  constructor() {
    this.reset();
    this.amountFirstItem.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((amount) => (this.tags[0].amount = amount));
  }

  addOneItem() {
    this.tags.push({
      label: 'New Item',
      amount: 20,
    });
  }

  removeOneItem() {
    this.tags.pop();
  }

  reset() {
    this.tags = JSON.parse(JSON.stringify(tagItems)); // Create a deep copy for example purposes
    this.amountFirstItem.setValue('', { emitEvent: false });
  }

  change(evt: SbbTagChange) {
    console.log(evt);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Tag, TagChange } from '@sbb-esta/angular-public/tag';
import { Subscription } from 'rxjs';

const tagItems: Tag[] = [
  {
    id: 'tag-1',
    label: 'Services',
    amount: 8,
    selected: false
  },
  {
    id: 'tag-2',
    label: 'Restaurants / Take Away',
    amount: 9,
    selected: false
  },
  {
    id: 'tag-3',
    label: 'Blumen',
    amount: 10,
    selected: false
  },
  {
    id: 'tag-4',
    label: 'Elektronik / Musik / Foto',
    amount: 11,
    selected: false
  }
];

const tagItems2: Tag[] = [
  {
    id: 'tag-2-1',
    label: 'Services',
    amount: 8,
    selected: false
  },
  {
    id: 'tag-2-2',
    label: 'Restaurants / Take Away',
    amount: 9,
    selected: false
  },
  {
    id: 'tag-2-3',
    label: 'Blumen',
    amount: 10,
    selected: false
  },
  {
    id: 'tag-2-4',
    label: 'Elektronik / Musik / Foto',
    amount: 11,
    selected: false
  }
];

@Component({
  selector: 'sbb-tag-showcase',
  templateUrl: './tag-showcase.component.html',
  styleUrls: ['./tag-showcase.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagShowcaseComponent implements OnInit, OnDestroy {
  form: FormGroup;
  tagItems: Tag[] = tagItems.slice();
  tagItemsReactive: Tag[] = tagItems2.slice();
  changeAmount = new FormControl();
  changeAmountReactive = new FormControl();

  get tags() {
    return this.form.get('tags') as FormArray;
  }

  private _tagFormSubscription = Subscription.EMPTY;
  private _changeAmountSubscription = Subscription.EMPTY;
  private _changeAmountReactiveSubscription = Subscription.EMPTY;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      tags: this.buildTags()
    });

    this._tagFormSubscription = this.subscribeOnTags();
    this._changeAmountSubscription = this.subscribeOnChangeAmount();
    this._changeAmountReactiveSubscription = this.subscribeOnChangeAmountReactive();
  }

  ngOnDestroy() {
    this._tagFormSubscription.unsubscribe();
    this._changeAmountSubscription.unsubscribe();
    this._changeAmountReactiveSubscription.unsubscribe();
  }

  subscribeOnTags(): Subscription {
    return this.tags.valueChanges.subscribe(() => {
      this.tags.controls.map((c, i) => {
        this.tagItemsReactive[i].selected = c.value;
      });
    });
  }

  subscribeOnChangeAmount(): Subscription {
    return this.changeAmount.valueChanges.subscribe(val => {
      this.tagItems[0].amount = val;
    });
  }

  subscribeOnChangeAmountReactive(): Subscription {
    return this.changeAmountReactive.valueChanges.subscribe(val => {
      this.tagItemsReactive[0].amount = val;
    });
  }

  buildTags(): FormArray {
    const arr = this.tagItemsReactive.map(tag => {
      return this._formBuilder.control(tag.selected);
    });

    return this._formBuilder.array(arr);
  }

  removeOneItem(mode: string) {
    switch (mode) {
      case 'templateDriven':
        this.tagItems.splice(-1);
        break;
      case 'reactive':
        this.tagItemsReactive.splice(-1);
        this.tags.removeAt(this.tags.length - 1);
        break;
    }
  }

  addOneItem(mode: string) {
    const itemToAdd: Tag = {
      label: 'New Item',
      amount: 20,
      selected: true
    };

    switch (mode) {
      case 'templateDriven':
        this.tagItems.push(Object.assign({}, itemToAdd));
        break;
      case 'reactive':
        this.tagItemsReactive.push(Object.assign({}, itemToAdd));
        this.tags.push(new FormControl(itemToAdd.selected));
        break;
    }
  }

  reset(mode: string) {
    switch (mode) {
      case 'templateDriven':
        this.tagItems = tagItems.slice();
        break;
      case 'reactive':
        this.tagItemsReactive = tagItems2.slice();
        this.form.setControl('tags', this.buildTags());
        this._tagFormSubscription = this.subscribeOnTags();
        break;
    }
  }

  change(evt: TagChange) {
    console.log(evt);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StatusType } from '../../../../../../sbb-esta/angular-business/status/src/status/status-type.enum';

import { SHOWCASE_STATUS_TABLE_DATA, TableData } from './table-data';

@Component({
  selector: 'sbb-status-showcase',
  templateUrl: './status-showcase.component.html',
  styleUrls: ['./status-showcase.component.scss']
})
export class StatusShowcaseComponent implements OnInit, OnDestroy {
  public readonly validType = StatusType.VALID;
  public readonly invalidType = StatusType.INVALID;
  public readonly warningType = StatusType.WARNING;

  private _originalRows = SHOWCASE_STATUS_TABLE_DATA;
  public rows = SHOWCASE_STATUS_TABLE_DATA;
  public headers = ['text', 'status'];
  public rowAlignment = 'sbb-table-align-left';

  private _updateSubscription: Subscription;

  public ngOnInit(): void {
    const source = interval(2000).pipe(takeUntil(timer(30000)));
    this._updateSubscription = source.subscribe(val => this._updateRows(val));
  }

  private _updateRows(value: number): void {
    const newRows = [];
    this._originalRows.forEach(row => newRows.push(Object.assign({}, row)));
    newRows.forEach((row: TableData) => {
      const changedText = ' ' + (value + 1);
      row.text += changedText;
      row.message += changedText;
      row.tooltip += changedText;
    });
    this.rows = newRows;
    this.rows.sort(() => Math.random() - 0.5);
  }

  public ngOnDestroy(): void {
    this._updateSubscription.unsubscribe();
  }
}

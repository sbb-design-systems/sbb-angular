import { Component, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExampleData } from '@sbb-esta/components-examples';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { moduleParams } from '../../module-params';

@Component({
  selector: 'sbb-example-list-viewer',
  templateUrl: './example-list-viewer.component.html',
  styleUrls: ['./example-list-viewer.component.scss'],
  standalone: false,
})
export class ExampleListViewerComponent implements OnInit {
  examples: Observable<ExampleData[] | null>;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.examples = moduleParams(this._route).pipe(
      map((params) => {
        const examples = ExampleData.find(params.packageName, params.id).filter(
          (example) => isDevMode() || !example.devOnly,
        );
        return examples.length === 0 ? null : examples;
      }),
    );
  }
}

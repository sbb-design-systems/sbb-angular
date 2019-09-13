import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HtmlLoader } from '../html-loader.service';

@Component({
  selector: 'sbb-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss']
})
export class ExampleViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() example: ComponentPortal<any>;
  @Input() name: string;
  @ViewChild('html', { static: false }) html: ElementRef;
  @ViewChild('ts', { static: false }) ts: ElementRef;
  @ViewChild('scss', { static: false }) scss: ElementRef;
  showSource = false;
  title: Observable<string>;
  get label() {
    return this.name
      .replace(/-/g, ' ')
      .replace(/(^[a-z]| [a-z])/g, m => m.toUpperCase())
      .replace(' Showcase', '');
  }
  private _destroyed = new Subject<void>();

  constructor(
    private _htmlLoader: HtmlLoader,
    private _route: ActivatedRoute,
    private _renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.title = combineLatest(this._route.params, this._route.data, (p, d) => ({
      ...p,
      ...d
    })).pipe(
      map(({ id }) =>
        (id as string)
          .replace(/^([a-z])/, m => m.toUpperCase())
          .replace(/-([a-z])/g, m => ` ${m.toUpperCase()}`)
      )
    );
  }

  ngAfterViewInit(): void {
    this._htmlLoader
      .with(this._route, this._renderer)
      .until(this._destroyed)
      .fromExamples(this.name, 'html')
      .applyTo(this.html);
    this._htmlLoader
      .with(this._route, this._renderer)
      .until(this._destroyed)
      .fromExamples(this.name, 'ts')
      .applyTo(this.ts);
    this._htmlLoader
      .with(this._route, this._renderer)
      .until(this._destroyed)
      .fromExamples(this.name, 'scss')
      .applyTo(this.scss);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}

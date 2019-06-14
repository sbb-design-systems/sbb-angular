import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GhettoboxDeletedEvent,
  GhettoboxRef,
  GhettoboxService,
  LinkGeneratorResult
} from '@sbb-esta/angular-public';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'sbb-ghettobox-showcase',
  templateUrl: './ghettobox-showcase.component.html',
  styleUrls: ['./ghettobox-showcase.component.scss']
})
export class GhettoboxShowcaseComponent implements OnDestroy {
  afterDeleteResponse1: any;
  afterDeleteResponse2: any;
  afterDeleteResponseContainer: any;

  private _ghettoboxInitLoadSubscription = Subscription.EMPTY;

  @ViewChild('testIcon1', { read: TemplateRef, static: true }) testIcon1: TemplateRef<any>;
  @ViewChild('testIcon2', { read: TemplateRef, static: true }) testIcon2: TemplateRef<any>;

  constructor(private _ghettoboxService: GhettoboxService, private _route: ActivatedRoute) {
    this._ghettoboxInitLoadSubscription = this._ghettoboxService.containerReady.subscribe(() => {
      this._ghettoboxService.add({
        message: 'This ghettobox is loaded at page load',
        icon: this.testIcon1
      });
    });
  }

  ngOnDestroy() {
    this._ghettoboxInitLoadSubscription.unsubscribe();
  }

  linkGenerator = (randomParam: number): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { test: randomParam },
      queryParamsHandling: 'merge',
      relativeTo: this._route
    };
  };

  addGhettobox(message: string) {
    const ghetto = this._ghettoboxService.add({
      message: message,
      link: this.linkGenerator(getRandomInt(10)),
      icon: this.testIcon2
    });

    ghetto.afterDelete.pipe(first()).subscribe((evt: GhettoboxDeletedEvent) => {
      this.afterDeleteResponseContainer = evt;
    });
  }

  deleteById(id: string) {
    this._ghettoboxService.deleteById(id);
  }

  deleteByIndex(index: number) {
    this._ghettoboxService.deleteByIndex(index);
  }

  deleteByRef() {
    const ghettoboxRef: GhettoboxRef = this._ghettoboxService.attachedGhettoboxes[0];
    ghettoboxRef.delete();
  }

  clear() {
    this._ghettoboxService.clearAll();
  }

  afterDelete1(evt: GhettoboxDeletedEvent) {
    this.afterDeleteResponse1 = evt;
  }

  afterDelete2(evt: GhettoboxDeletedEvent) {
    this.afterDeleteResponse2 = evt;
  }

  printAttachedGhettoboxesIDS() {
    return this._ghettoboxService.attachedGhettoboxes.map(g => {
      return {
        id: g.id
      };
    });
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkGeneratorResult } from 'sbb-angular';
import { GhettoboxService, GhettoboxState, GhettoboxDeletedEvent } from 'projects/sbb-angular/src/lib/ghettobox/ghettobox';
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

  @ViewChild('testIcon1', { read: TemplateRef }) testIcon1: TemplateRef<any>;
  @ViewChild('testIcon2', { read: TemplateRef }) testIcon2: TemplateRef<any>;

  constructor(private _ghettoboxService: GhettoboxService, private route: ActivatedRoute) {
    this._ghettoboxInitLoadSubscription =
      this._ghettoboxService.ready.subscribe(
        () => {
          this._ghettoboxService.add(
            { message: 'This ghettobox is loaded at page load', icon: this.testIcon1 });
        }
      );
  }

  ngOnDestroy() {
    this._ghettoboxInitLoadSubscription.unsubscribe();
  }

  linkGenerator = (randomParam: number): LinkGeneratorResult => {
    return {
      routerLink: ['.'],
      queryParams: { test: randomParam },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    };
  }

  addGhettobox() {
    const ghetto = this._ghettoboxService.add(
      { message: 'Hello ghettobox', link: this.linkGenerator(getRandomInt(10)), icon: this.testIcon2 });

    ghetto.componentInstance.afterDelete.pipe(first()).subscribe(
      (evt: GhettoboxDeletedEvent) => {
        this.afterDeleteResponseContainer = evt;
      }
    );
  }

  deleteById(id: string) {
    this._ghettoboxService.deleteById(id);
  }

  deleteByIndex(index: number) {
    this._ghettoboxService.deleteByIndex(index);
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
    return this._ghettoboxService.attachedGhettoboxes.map(
      g => {
        return {
          id: g.id
        };
      }
    );
  }

}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
